module.exports = (app, connexion) => {
  app.post('/transformer-en-tier', (req, res) => {
    if (!req.session.utilisateur || !req.session.utilisateur.id) {
      return res.status(401).send("Non connecté");
    }
    const userId = req.session.utilisateur.id;
    const carteId = parseInt(req.body.carte_id);
    const tier = req.body.tier;
    const quantite = parseInt(req.body.quantite) || 1; // ← récupère la quantité demandée

    const tiers = {
      T1: { from: 'nb_exemplaires', to: 'nb_brillante' },
      T2: { from: 'nb_brillante', to: 'nb_alternative' },
      T3: { from: 'nb_alternative', to: 'nb_noir_blanc' },
      T4: { from: 'nb_noir_blanc', to: 'nb_gold' }
    };

    const config = tiers[tier];
    if (!config) return res.status(400).send('Tier invalide');

    // Vérifie la quantité disponible
    connexion.query(`
      SELECT ${config.from} FROM collections
      WHERE utilisateur_id = ? AND carte_id = ?
    `, [userId, carteId], (err, results) => {
      if (err || results.length === 0) return res.status(500).send('Erreur SQL');

      const disponibles = results[0][config.from];
      const necessaires = quantite * 5;

      if (disponibles < necessaires) {
        return res.status(400).send(`Il vous faut ${necessaires} cartes pour faire ${quantite} transformation(s).`);
      }

      // Mise à jour en une requête : -5*quantite, +quantite
      connexion.query(`
        UPDATE collections
        SET ${config.from} = ${config.from} - ?,
            ${config.to} = ${config.to} + ?
        WHERE utilisateur_id = ? AND carte_id = ?
      `, [necessaires, quantite, userId, carteId], (err2) => {
        if (err2) return res.status(500).send('Erreur mise à jour');
        res.sendStatus(200);
      });
    });
  });
};
