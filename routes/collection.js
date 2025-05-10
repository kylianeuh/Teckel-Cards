module.exports = (app, pool, rarityLetters, color1, color2) => {
    app.get('/collection', async (req, res) => {
      try {
        // Vérifie si l'utilisateur est connecté
        if (!req.session.utilisateur || !req.session.utilisateur.id) {
          return res.redirect("/connexion");
        }
  
        const utilisateurId = req.session.utilisateur.id;
  
        const result = await pool.query(
          `SELECT cartes.*, collections.nb_exemplaires, collections.nb_brillante, 
                  collections.nb_alternative, collections.nb_noir_blanc, collections.nb_gold
           FROM collections
           JOIN cartes ON collections.carte_id = cartes.id
           WHERE collections.utilisateur_id = $1`,
          [utilisateurId]
        );

        const cartes = result.rows.map(row => {
          let tier = 0;
          if (row.nb_gold > 0) tier = 4;
          else if (row.nb_noir_blanc > 0) tier = 3;
          else if (row.nb_alternative > 0) tier = 2;
          else if (row.nb_brillante > 0) tier = 1;
          else if (row.nb_exemplaires > 0) tier = 0;
        
          return { ...row, tier };
        });
        
        const statsTier = {
          T0: 0,
          T1: 0,
          T2: 0,
          T3: 0,
          T4: 0
        };
        
        cartes.forEach(carte => {
          if (carte.nb_exemplaires > 0) statsTier.T0++;
          if (carte.nb_brillante > 0)   statsTier.T1++;
          if (carte.nb_alternative > 0) statsTier.T2++;
          if (carte.nb_noir_blanc > 0)  statsTier.T3++;
          if (carte.nb_gold > 0)        statsTier.T4++;
        });
          
  
        res.render("collection", {
          utilisateur: req.session.utilisateur,
            cartes,
            statsTier,
            color1: {
              1: "#b87333", // Cuivre
              2: "#b0c4de", // Titane
              3: "#d2d1cf", // Platine
              4: "#9966cc", // Améthyste
              5: "#e0115f", // Rubis
              6: "#ffd700"  // Or
            },
            color2: {
              1: "#dab892",
              2: "#d4d4e7",
              3: "#e1e1e1",
              4: "#b48bc9",
              5: "#e68ca8",
              6: "#ffe680"
            },
            rarityLetters: {
              1: "C",
              2: "T",
              3: "P",
              4: "A",
              5: "R",
              6: "O"
            }
          });
          
          
  
      } catch (err) {
        console.error("❌ Erreur dans la route /collection :", err);
        res.status(500).send("Erreur serveur");
      }
    });
  };
  