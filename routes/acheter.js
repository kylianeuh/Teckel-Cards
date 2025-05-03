module.exports = (app, connexion) => {
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

      connexion.query('UPDATE utilisateurs SET jetons = jetons - ? WHERE id = ?', [produit.prix, idUtilisateur]);

      const isGodPack = produit.quantite > 1 && Math.random() < 0.05;
      let cartesTirees = [];
      let tiragesRestants = produit.quantite;

      // ✅ LA FONCTION QUI MANQUAIT
      function tirerCarteParTier(tier, callback) {
        connexion.query('SELECT id FROM cartes ORDER BY RAND() LIMIT 1', (err, results) => {
          if (err || results.length === 0) return callback(err || new Error("Aucune carte trouvée"), null);
          const carteId = results[0].id;
          callback(null, { carteId, tier });
        });
      }

      function tirerProchaineCarte() {
        if (tiragesRestants <= 0) {
          const insertions = cartesTirees.map(({ carteId, tier }) => {
            const colonnes = ['nb_exemplaires', 'nb_brillante', 'nb_alternative', 'nb_noir_blanc', 'nb_gold'];
            const colonne = colonnes[tier] || 'nb_exemplaires';

            return new Promise((resolve, reject) => {
              connexion.query(`
                INSERT INTO cartes_utilisateur (utilisateur_id, carte_id, ${colonne})
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE ${colonne} = ${colonne} + 1
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
