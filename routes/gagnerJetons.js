module.exports = (app, pool, DateTime) => {
  app.post("/gagner-jetons", (req, res) => {
    const utilisateur_id = req.session.utilisateur.id;

    pool.query(
      "SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = $1",
      [utilisateur_id],
      (err, result) => {
        if (err || result.rows.length === 0) {
          return res.status(500).json({ success: false, message: "Erreur serveur ou utilisateur introuvable" });
        }

        const utilisateur = result.rows[0];
        const maintenant = DateTime.now();
        const prochaineRecolte = utilisateur.prochaine_recolte
          ? DateTime.fromSQL(utilisateur.prochaine_recolte)
          : null;

        if (prochaineRecolte && maintenant < prochaineRecolte) {
          return res.json({
            success: false,
            message: `Disponible à ${prochaineRecolte.toFormat("HH:mm")}`,
            prochaineRecolte: prochaineRecolte.toFormat("HH:mm")
          });
        }

        const nouvelleRecolte = maintenant.plus({ hours: 2 });

        pool.query(
          "UPDATE utilisateurs SET jetons = jetons + 2, prochaine_recolte = $1 WHERE id = $2",
          [nouvelleRecolte.toFormat("yyyy-MM-dd HH:mm:ss"), utilisateur_id],
          (err2) => {
            if (err2) {
              return res.status(500).json({ success: false, message: "Erreur mise à jour jetons" });
            }

            req.session.utilisateur.jetons += 2;

            return res.json({
              success: true,
              message: "Vous avez gagné 2 jetons.",
              newJetons: req.session.utilisateur.jetons,
              prochaineRecolte: nouvelleRecolte.toFormat("HH:mm")
            });
          }
        );
      }
    );
  });
};
