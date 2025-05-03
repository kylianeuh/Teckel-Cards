module.exports = (app, connexion, rarityNames, rarityLetters, color1, color2) => {

  // Route GET /marche : affichage du marché
  app.get('/marche', (req, res) => {
    if (!req.session.utilisateur) {
      return res.redirect('/connexion');
    }
    connexion.query(`
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
        cartes.id
      FROM ventes
      JOIN cartes ON cartes.id = ventes.carte_id
      JOIN utilisateurs ON utilisateurs.id = ventes.vendeur_id
    `, (err, results) => {
      if (err) {
        console.error('Erreur SQL marché:', err);
        return res.redirect('/');
      }

      res.render('marche', {
        utilisateur: req.session.utilisateur,
        ventes: results,
        success: req.query.success,
        rarityNames,
        rarityLetters,
        color1,
        color2
      });
    });
  });

  // 🆕 Fonction utilitaire pour tirer une carte d’un certain tier
  function tirerCarteParTier(connexion, tier, callback) {
    connexion.query('SELECT id FROM cartes WHERE tier = ? ORDER BY RAND() LIMIT 1', [tier], (err, results) => {
      if (err || results.length === 0) return callback(err || new Error("Aucune carte trouvée"), null);
      callback(null, results[0].id);
    });
  }

  // ✅ Nouvelle route POST /marche/acheter
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

    connexion.query('SELECT jetons FROM utilisateurs WHERE id = ?', [idUtilisateur], (err, results) => {
      if (err) return res.redirect('/marche?success=error');
      if (results[0].jetons < produit.prix) return res.redirect('/marche?success=notenough');

      // Déduire les jetons
      connexion.query('UPDATE utilisateurs SET jetons = jetons - ? WHERE id = ?', [produit.prix, idUtilisateur]);

      // 🎁 Tirage des cartes
      let cartesTirees = [];
      let tiragesRestants = produit.quantite;
      const isGodPack = produit.quantite > 1 && Math.random() < 0.05;

      function tirerProchaineCarte() {
        if (tiragesRestants <= 0) {
          const queries = cartesTirees.map(carteId => {
            return new Promise((resolve, reject) => {
              connexion.query(`
                INSERT INTO cartes_utilisateur (utilisateur_id, carte_id, quantite)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE quantite = quantite + 1
              `, [idUtilisateur, carteId], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          });

          Promise.all(queries)
            .then(() => res.redirect('/marche?success=ok'))
            .catch(() => res.redirect('/marche?success=error'));
          return;
        }

        let tier = isGodPack ? (tiragesRestants === 1 ? 4 : 3) : produit.tier;

        tirerCarteParTier(connexion, tier, (err, carteId) => {
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
