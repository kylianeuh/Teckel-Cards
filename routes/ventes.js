module.exports = (app, pool) => {
  // Vendre une carte directement
  app.post('/vendre-direct', (req, res) => {
    const { carte_id, quantite, type } = req.body;
    const utilisateur_id = req.session.utilisateur.id;
    const quantiteInt = parseInt(quantite);

    const typesAutorises = ['nb_exemplaires', 'nb_brillante', 'nb_alternative', 'nb_noir_blanc', 'nb_gold'];
    if (!quantiteInt || quantiteInt <= 0) return res.status(400).send('Quantité invalide');
    if (!typesAutorises.includes(type)) return res.status(400).send('Type de carte non pris en charge');

    pool.query(`
      SELECT nb_exemplaires, nb_brillante, nb_alternative, nb_noir_blanc, nb_gold, cartes.rarete
      FROM collections
      JOIN cartes ON cartes.id = collections.carte_id
      WHERE collections.utilisateur_id = $1 AND collections.carte_id = $2
    `, [utilisateur_id, carte_id], (err, result) => {
      if (err || result.rows.length === 0) return res.status(500).send('Erreur serveur');

      const carte = result.rows[0];
      const possedees = carte[type];
      if (possedees < quantiteInt) return res.status(400).send(`Pas assez de cartes (${type})`);

      const { prixVente, mapTier } = require('../script/constantesCartes');
      const tier = mapTier[type];
      const prixUnitaire = prixVente[carte.rarete][tier];
      const montantTotal = prixUnitaire * quantiteInt;

      pool.query(`
        UPDATE collections
        SET ${type} = ${type} - $1
        WHERE utilisateur_id = $2 AND carte_id = $3
      `, [quantiteInt, utilisateur_id, carte_id], (err2) => {
        if (err2) return res.status(500).send('Erreur mise à jour');

        pool.query(`
          UPDATE utilisateurs SET jetons = jetons + $1 WHERE id = $2
        `, [montantTotal, utilisateur_id], (err3) => {
          if (err3) return res.status(500).send('Erreur crédit jetons');
          req.session.utilisateur.jetons += montantTotal;
          return res.status(200).send('Vente réussie');
        });
      });
    });
  });

  // Mettre en vente sur le marché
  app.post('/mettre-en-vente', (req, res) => {
    const { carte_id, quantite, type } = req.body;
    const utilisateur_id = req.session.utilisateur.id;
    const quantiteInt = parseInt(quantite);
    if (!quantiteInt || quantiteInt <= 0) return res.status(400).send('Quantité invalide');

    pool.query(`
      SELECT nb_exemplaires, nb_brillante, cartes.rarete
      FROM collections
      JOIN cartes ON cartes.id = collections.carte_id
      WHERE collections.utilisateur_id = $1 AND collections.carte_id = $2
    `, [utilisateur_id, carte_id], (err, result) => {
      if (err || result.rows.length === 0) return res.status(500).send('Erreur serveur');

      const carte = result.rows[0];
      if ((type === 'nb_exemplaires' && carte.nb_exemplaires < quantiteInt) ||
          (type === 'nb_brillante' && carte.nb_brillante < quantiteInt)) {
        return res.status(400).send('Pas assez de cartes pour vendre');
      }

      const prixSuggestion = { 1: 1, 2: 2, 3: 6, 4: 15, 5: 30, 6: 150 };
      const prixParUnite = prixSuggestion[carte.rarete] || 10;

      pool.query(`
        INSERT INTO ventes (vendeur_id, carte_id, quantite, prix_par_unite, type)
        VALUES ($1, $2, $3, $4, $5)
      `, [utilisateur_id, carte_id, quantiteInt, prixParUnite, type], (err2) => {
        if (err2) return res.status(500).send('Erreur insertion');

        pool.query(`
          UPDATE collections SET ${type} = ${type} - $1
          WHERE utilisateur_id = $2 AND carte_id = $3
        `, [quantiteInt, utilisateur_id, carte_id], (err3) => {
          if (err3) return res.status(500).send('Erreur mise à jour collection');
          return res.status(200).send('Carte mise en vente');
        });
      });
    });
  });

  // Acheter une carte sur le marché
  app.post('/acheter', (req, res) => {
    const { vente_id } = req.body;
    const acheteur_id = req.session.utilisateur.id;

    pool.query(`
      SELECT v.*, u.pseudo AS vendeur_pseudo
      FROM ventes v
      JOIN utilisateurs u ON u.id = v.vendeur_id
      WHERE v.id = $1
    `, [vente_id], (err, result) => {
      if (err || result.rows.length === 0) return res.redirect('/marche');

      const vente = result.rows[0];
      if (vente.vendeur_id === acheteur_id) {
        return res.send('<h1>🚫 Tu ne peux pas acheter ta propre carte !</h1><a href="/marche">Retour</a>');
      }

      pool.query('SELECT jetons FROM utilisateurs WHERE id = $1', [acheteur_id], (err2, resultJetons) => {
        if (err2 || resultJetons.rows.length === 0) return res.redirect('/marche');

        const jetonsAcheteur = resultJetons.rows[0].jetons;
        if (jetonsAcheteur < vente.prix_par_unite) {
          return res.send('<h1>🚫 Pas assez de jetons !</h1><a href="/marche">Retour</a>');
        }

        // Débit acheteur
        pool.query('UPDATE utilisateurs SET jetons = jetons - $1 WHERE id = $2', [vente.prix_par_unite, acheteur_id]);
        // Crédit vendeur
        pool.query('UPDATE utilisateurs SET jetons = jetons + $1 WHERE id = $2', [vente.prix_par_unite, vente.vendeur_id]);
        // Ajouter la carte à l'acheteur
        pool.query(`
          INSERT INTO collections (utilisateur_id, carte_id, ${vente.type})
          VALUES ($1, $2, 1)
          ON CONFLICT (utilisateur_id, carte_id)
          DO UPDATE SET ${vente.type} = collections.${vente.type} + 1
        `, [acheteur_id, vente.carte_id]);

        // Mettre à jour la quantité ou supprimer la vente
        if (vente.quantite > 1) {
          pool.query('UPDATE ventes SET quantite = quantite - 1 WHERE id = $1', [vente_id]);
        } else {
          pool.query('DELETE FROM ventes WHERE id = $1', [vente_id]);
        }

        req.session.utilisateur.jetons -= vente.prix_par_unite;
        return res.redirect('/marche?success=1');
      });
    });
  });
};
