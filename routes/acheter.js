module.exports = (app, pool) => {
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

    // ✅ Vérification des jetons
    pool.query('SELECT jetons FROM utilisateurs WHERE id = $1', [idUtilisateur], (err, result) => {
      if (err || result.rows.length === 0) return res.redirect('/marche?success=error');
      if (result.rows[0].jetons < produit.prix) return res.redirect('/marche?success=notenough');

      // ✅ Déduction des jetons
      pool.query('UPDATE utilisateurs SET jetons = jetons - $1 WHERE id = $2', [produit.prix, idUtilisateur]);

      const isGodPack = produit.quantite > 1 && Math.random() < 0.05;
      let cartesTirees = [];
      let tiragesRestants = produit.quantite;

      // ✅ Tirage d'une carte aléatoire
      function tirerCarteParTier(tier, callback) {
        pool.query('SELECT id FROM cartes ORDER BY RANDOM() LIMIT 1', (err, result) => {
          if (err || result.rows.length === 0) return callback(err || new Error("Aucune carte trouvée"), null);
          const carteId = result.rows[0].id;
          callback(null, { carteId, tier });
        });
      }

      // ✅ Enregistrement des cartes tirées
      function tirerProchaineCarte() {
        if (tiragesRestants <= 0) {
          const insertions = cartesTirees.map(({ carteId, tier }) => {
            const colonnes = ['nb_exemplaires', 'nb_brillante', 'nb_alternative', 'nb_noir_blanc', 'nb_gold'];
            const colonne = colonnes[tier] || 'nb_exemplaires';

            return new Promise((resolve, reject) => {
              pool.query(`
                INSERT INTO cartes_utilisateur (utilisateur_id, carte_id, ${colonne})
                VALUES ($1, $2, 1)
                ON CONFLICT (utilisateur_id, carte_id)
                DO UPDATE SET ${colonne} = cartes_utilisateur.${colonne} + 1
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

        tirerCarteParTier(tier, (err, result) => {
          if (err) return res.redirect('/marche?success=error');
          cartesTirees.push(result);
          tiragesRestants--;
          tirerProchaineCarte();
        });
      }

      tirerProchaineCarte();
    });
  });
};
