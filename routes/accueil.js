module.exports = (app, pool, DateTime) => {
  const verifierConnexion = (req, res, next) => {
    if (req.session.utilisateur) next();
    else res.redirect("/connexion");
  };

  app.get('/', verifierConnexion, async (req, res) => {
    const utilisateur_id = req.session.utilisateur.id;

    let resultRiches = [];
    let resultCollection = [];
    let resultCartesObtenue = [];

    try {
      const userResult = await pool.query(
        'SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = $1',
        [utilisateur_id]
      );

      if (userResult.rows.length === 0) {
        return res.redirect('/connexion');
      }

      req.session.utilisateur.jetons = userResult.rows[0].jetons;

      const maintenant = DateTime.now();
      let recolteDisponible = true;
      let prochaineRecolte = null;
      const prochaineRecolteParis = DateTime.fromSQL(userResult.rows[0].prochaine_recolte)
      .setZone("Europe/Paris")
      .toFormat("cccc d LLLL yyyy 'à' HH'h'mm");

      if (userResult.rows[0].prochaine_recolte) {
        const recolte = DateTime.fromSQL(userResult.rows[0].prochaine_recolte);
        if (maintenant < recolte) {
          recolteDisponible = false;
          prochaineRecolte = recolte.toFormat('HH:mm');
        }
      }

      // 🥇 Plus riches
      try {
        const resRiches = await pool.query(
          'SELECT pseudo, jetons FROM utilisateurs ORDER BY jetons DESC LIMIT 10'
        );
        resultRiches = resRiches.rows;
      } catch (err) {
        console.warn("⚠️ Classement Riches :", err.message);
      }

      // 📦 Collection la plus complète (cartes différentes)
      try {
        const resCollection = await pool.query(
          `SELECT u.pseudo, COUNT(DISTINCT c.carte_id) AS total_cartes
           FROM collections c
           JOIN utilisateurs u ON c.utilisateur_id = u.id
           GROUP BY u.pseudo
           ORDER BY total_cartes DESC
           LIMIT 10`
        );
        resultCollection = resCollection.rows;
      } catch (err) {
        console.warn("⚠️ Classement Collections :", err.message);
      }

      // 🃏 Plus de cartes obtenues (total y compris doublons)
      try {
        const resTirages = await pool.query(
          `SELECT u.pseudo,
       SUM(c.nb_exemplaires + c.nb_brillante + c.nb_alternative + c.nb_noir_blanc + c.nb_gold) AS total_cartes
FROM collections c
JOIN utilisateurs u ON c.utilisateur_id = u.id
GROUP BY u.pseudo
ORDER BY total_cartes DESC
LIMIT 10;`
        );
        resultCartesObtenue = resTirages.rows;
        console.log("👑 Classement cartes obtenues :", resultCartesObtenue);
      } catch (err) {
        console.warn("⚠️ Classement Tirages :", err.message);
      }

      // 🔄 Rendu de la page
      res.render('index', {
        utilisateur: req.session.utilisateur,
        recolteDisponible,
        prochaineRecolte,
        prochaineRecolteDate: prochaineRecolteParis,
        boosters: [
          { id: 1, image: "Booster-1-1.webp" },
          { id: 2, image: "Booster-1-2.webp" },
          { id: 3, image: "Booster-1-3.webp" },
          { id: 4, image: "Booster-1-4.webp" }
        ],
        resultRiches,
        resultCollection,
        resultCartesObtenue
      });

    } catch (err) {
      console.error("❌ Erreur principale dans la route '/' :", err);
      res.redirect('/connexion');
    }
  });
};
