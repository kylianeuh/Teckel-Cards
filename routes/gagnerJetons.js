module.exports = (app, pool, DateTime) => {
  app.post("/gagner-jetons", (req, res) => {
    if (!req.session.utilisateur || !req.session.utilisateur.id) {
      return res.status(401).json({ success: false, message: "Utilisateur non connecté." });
    }

    const utilisateur_id = req.session.utilisateur.id;

    pool.query(
      "SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = $1",
      [utilisateur_id],
      (err, result) => {
        if (err || result.rows.length === 0) {
          return res.status(500).json({ success: false, message: "Erreur serveur ou utilisateur introuvable" });
        }

        const utilisateur = result.rows[0];
        const maintenant = DateTime.utc();

        let prochaineRecolte = null;
        let prochaineRecolteParis = null;

        if (utilisateur.prochaine_recolte) {
          const brute = utilisateur.prochaine_recolte;
          console.log("Valeur brute de prochaine_recolte :", brute);

          const isoString = brute instanceof Date ? brute.toISOString() : brute;
          prochaineRecolte = DateTime.fromISO(isoString).setZone("utc");
          prochaineRecolteParis = DateTime.fromISO(isoString).setZone("Europe/Paris");

          if (!prochaineRecolte.isValid) {
            console.warn("⚠️ Date UTC invalide !");
          }
          if (!prochaineRecolteParis.isValid) {
            console.warn("⚠️ Date Europe/Paris invalide !");
          }
        }

        console.log("UTC maintenant :", maintenant.toISO());
        console.log("UTC prochaine récolte :", prochaineRecolte?.toISO());
        console.log("Paris prochaine récolte :", prochaineRecolteParis?.toISO());

        if (prochaineRecolte && maintenant < prochaineRecolte) {
          return res.json({
            success: false,
            message: `Disponible à ${prochaineRecolteParis.toFormat("HH'h'mm")}`,
            prochaineRecolte: prochaineRecolteParis.toFormat("HH'h'mm")
          });
        }

        // Mise à jour
        pool.query(
          "UPDATE utilisateurs SET jetons = jetons + 3, prochaine_recolte = NOW() + INTERVAL '2 HOURS' WHERE id = $1",
          [utilisateur_id],
          (err2) => {
            if (err2) {
              console.error("Erreur mise à jour :", err2);
              return res.status(500).json({ success: false, message: "Erreur mise à jour jetons." });
            }

            pool.query(
              "SELECT jetons, prochaine_recolte FROM utilisateurs WHERE id = $1",
              [utilisateur_id],
              (err3, result2) => {
                if (err3 || result2.rows.length === 0) {
                  return res.status(500).json({ success: false, message: "Erreur rechargement utilisateur" });
                }

                const utilisateur = result2.rows[0];
                req.session.utilisateur.jetons = utilisateur.jetons;

                const brute = utilisateur.prochaine_recolte;
                const isoString = brute instanceof Date ? brute.toISOString() : brute;
                const prochaineRecolte = DateTime.fromISO(isoString).setZone("utc");
                const prochaineRecolteParis = DateTime.fromISO(isoString).setZone("Europe/Paris");

                return res.json({
                  success: true,
                  message: "Vous avez gagné 3 jetons.",
                  newJetons: utilisateur.jetons,
                  prochaineRecolte: prochaineRecolteParis?.toFormat("HH'h'mm") ?? "inconnue"
                });
              }
            );
          }
        );
      }
    );
  });
};
