module.exports = (app, pool, DateTime) => {
  const verifierConnexion = (req, res, next) => {
    if (req.session.utilisateur) next();
    else res.redirect("/connexion");
  };

  app.get('/', verifierConnexion, (req, res) => {
    const utilisateur_id = req.session.utilisateur.id;

    // ✅ PostgreSQL utilise $1 pour les paramètres
    pool.query('SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = $1', [utilisateur_id], (err, result) => {
      if (err || result.rows.length === 0) {
        console.error("Erreur base de données :", err);
        return res.redirect('/connexion');
      }

      // ✅ avec pg, les résultats sont dans result.rows
      req.session.utilisateur.jetons = result.rows[0].jetons;

      const maintenant = DateTime.now();
      let recolteDisponible = true;
      let prochaineRecolte = null;

      if (result.rows[0].prochaine_recolte) {
        const recolte = DateTime.fromSQL(result.rows[0].prochaine_recolte);
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
