module.exports = (app, pool, rarityLetters, color1, color2) => {
  app.get("/collection", async (req, res) => {
    if (!req.session.utilisateur || !req.session.utilisateur.id) {
      return res.status(401).send("Non connecté");
    }

    const utilisateur_id = req.session.utilisateur.id;
    const { taillesSeries } = require("../script/constantesCartes");

    try {
      const { rows } = await pool.query(`
        SELECT 
          c.nb_exemplaires, 
          c.nb_brillante, 
          c.nb_alternative, 
          c.nb_noir_blanc, 
          c.nb_gold, 
          cartes.nom, 
          cartes.image_url, 
          cartes.rarete, 
          cartes.id, 
          cartes.description
        FROM collections c
        JOIN cartes ON cartes.id = c.carte_id
        WHERE c.utilisateur_id = $1
      `, [utilisateur_id]);

      let totalBasic = 0;
      let totalShiny = 0;
      let totalUniques = 0;

      rows.forEach(carte => {
        const totalPossedees =
          carte.nb_exemplaires + carte.nb_brillante + carte.nb_alternative + carte.nb_noir_blanc + carte.nb_gold;
        if (totalPossedees > 0) {
          totalUniques++;
          totalBasic += carte.nb_exemplaires;
          totalShiny += carte.nb_brillante;
        }
      });

      res.render("collection", {
        utilisateur: req.session.utilisateur,
        cartes: rows,
        totalBasic,
        totalShiny,
        totalUniques,
        rarityLetters,
        color1,
        color2,
        taillesSeries
      });
    } catch (err) {
      console.error("Erreur SQL collection :", err);
      res.redirect("/");
    }
  });
};
