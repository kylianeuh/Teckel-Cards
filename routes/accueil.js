module.exports = (app, connexion, DateTime) => {
  const verifierConnexion = (req, res, next) => {
    if (req.session.utilisateur) next();
    else res.redirect("/connexion");
  };

  app.get('/', verifierConnexion, (req, res) => {
    const utilisateur_id = req.session.utilisateur.id;

    connexion.query('SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = ?', [utilisateur_id], (err, results) => {
      if (err || results.length === 0) return res.redirect('/connexion');

      req.session.utilisateur.jetons = results[0].jetons;

      const maintenant = DateTime.now();
      let recolteDisponible = true;
      let prochaineRecolte = null;

      if (results[0].prochaine_recolte) {
        const recolte = DateTime.fromSQL(results[0].prochaine_recolte);
        if (maintenant < recolte) {
          recolteDisponible = false;
          prochaineRecolte = recolte.toFormat('HH:mm');
        }
      }

      res.render('index', {
        utilisateur: req.session.utilisateur,
        recolteDisponible,
        prochaineRecolte,
        boosters: [
          { id: 1, image: "Booster-1-1.webp" },
          { id: 2, image: "Booster-1-2.webp" },
          { id: 3, image: "Booster-1-3.webp" },
          { id: 4, image: "Booster-1-4.webp" }
        ],
        resultRiches: [],
        resultCollection: [],
        resultCartesObtenue: []
      });
    });
  });
};
