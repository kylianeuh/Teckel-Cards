module.exports = (app, pool, rarityNames, rarityLetters, color1, color2) => {

  // 📦 Route GET /marche : afficher les ventes
  app.get('/marche', (req, res) => {
    if (!req.session.utilisateur) return res.redirect('/connexion');

    pool.query(`
      SELECT 
        ventes.id AS vente_id,
        ventes.carte_id,
        ventes.quantite,
        ventes.prix_par_unite,
        ventes.type,
        ventes.date_vente,
        utilisateurs.pseudo AS vendeur,
        cartes.nom,
        cartes.image_url,
        cartes.rarete,
        cartes.description,
        cartes.id
      FROM ventes
      JOIN cartes ON cartes.id = ventes.carte_id
      JOIN utilisateurs ON utilisateurs.id = ventes.vendeur_id
    `, (err, result) => {
      if (err) {
        console.error('Erreur SQL marché:', err);
        return res.redirect('/');
      }

      const cartes = result.rows.map(vente => {
        let tier = 0;
        const type = vente.type;
      
        if (type === 'nb_gold') tier = 4;
        else if (type === 'nb_noir_blanc') tier = 3;
        else if (type === 'nb_alternative') tier = 2;
        else if (type === 'nb_brillante') tier = 1;
        else tier = 0;
      
        return { ...vente, tier };
      });
      

      res.render('marche', {
        utilisateur: req.session.utilisateur,
        ventes: cartes,
        rarityNames,
        rarityLetters,
        color1,
        color2,
        success: req.query.success
      });
    });
  });

  // 🎲 Fonction tirage PostgreSQL
  function tirerCarteParTier(pool, tier, callback) {
    pool.query('SELECT id FROM cartes WHERE rarete = $1 ORDER BY RANDOM() LIMIT 1', [tier], (err, result) => {
      if (err || result.rows.length === 0) return callback(err || new Error("Aucune carte trouvée"), null);
      callback(null, result.rows[0].id);
    });
  }

  // 🛒 Route POST /marche/acheter
  app.post('/marche/acheter', (req, res) => {
    const type = req.body.type;
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.redirect('/connexion');
    const idUtilisateur = utilisateur.id;

    const boutique = {
      carteT1: { prix: 150, quantite: 1, tier: 1 },
      boosterT1: { prix: 400, quantite: 3, tier: 1 },
      carteT2: { prix: 300, quantite: 1, tier: 2 },
      boosterT2: { prix: 800, quantite: 3, tier: 2 },
    };

    const produit = boutique[type];
    if (!produit) return res.redirect('/marche?success=invalid');

    pool.query('SELECT jetons FROM utilisateurs WHERE id = $1', [idUtilisateur], (err, result) => {
      if (err) return res.redirect('/marche?success=error');
      if (result.rows[0].jetons < produit.prix) return res.redirect('/marche?success=notenough');

      // Déduire les jetons
      pool.query('UPDATE utilisateurs SET jetons = jetons - $1 WHERE id = $2', [produit.prix, idUtilisateur]);

      let cartesTirees = [];
      let tiragesRestants = produit.quantite;
      const isGodPack = produit.quantite > 1 && Math.random() < 0.05;

      function tirerProchaineCarte() {
        if (tiragesRestants <= 0) {
          const insertions = cartesTirees.map(carteId => {
            return new Promise((resolve, reject) => {
              pool.query(`
                INSERT INTO collections (utilisateur_id, carte_id, nb_exemplaires)
                VALUES ($1, $2, 1)
                ON CONFLICT (utilisateur_id, carte_id)
                DO UPDATE SET nb_exemplaires = collections.nb_exemplaires + 1
              `, [idUtilisateur, carteId], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          });

          Promise.all(insertions)
            .then(() => res.redirect('/marche?success=ok'))
            .catch(() => res.redirect('/marche?success=error'));

          return;
        }

        const tier = isGodPack ? (tiragesRestants === 1 ? 4 : 3) : produit.tier;

        tirerCarteParTier(pool, tier, (err, carteId) => {
          if (err) return res.redirect('/marche?success=error');
          cartesTirees.push(carteId);
          tiragesRestants--;
          tirerProchaineCarte();
        });
      }

      tirerProchaineCarte();
    });
  });
};