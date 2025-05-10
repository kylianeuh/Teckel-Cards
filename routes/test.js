module.exports = (app, pool, rarityLetters, color1, color2) => {
    // PAGE COLLECTION (existante)
    app.get("/collection", (req, res) => {
      if (!req.session.utilisateur || !req.session.utilisateur.id) {
        return res.status(401).send("Non connecté");
      }
  
      const utilisateur_id = req.session.utilisateur.id;
      const { taillesSeries } = require("../script/constantesCartes");
  
      pool.query(`
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
      `, [utilisateur_id], (err, result) => {
        if (err) {
          console.error("Erreur SQL collection :", err);
          return res.redirect("/");
        }
  
        const results = result.rows;
        let totalBasic = 0;
        let totalShiny = 0;
        let totalUniques = 0;
  
        results.forEach(carte => {
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
          cartes: results,
          totalBasic,
          totalShiny,
          totalUniques,
          rarityLetters,
          color1,
          color2,
          taillesSeries
        });
      });
    });
  
    // ✅ PAGE TEST POUR VISU CARTES RESPONSIVES
    app.get("/test", (req, res) => {
      res.render("test", {
        rarityLetters,
        color1,
        color2
      });
    });
  };
  