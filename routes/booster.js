module.exports = (app, connexion, calculerCartes, prixBoosters, color1, color2, color3, rarityLetters) => {
  
    // Tirage d’un booster
    app.get('/ouvrir-booster', (req, res) => {
      const boosterChoisi = parseInt(req.query.booster) || 1;
      const utilisateur_id = req.session.utilisateur.id;
      const { taillesSeries } = require("../script/constantesCartes");
      req.session.dernierBoosterOuvert = boosterChoisi;
  
      // Si un booster est déjà en cours, on le réaffiche
      if (req.session.boosterEnCours && req.session.boosterEnCours.cartes) {
        return renderBooster(req, res, req.session.boosterEnCours.cartes);
      }
  
      const prix = prixBoosters[boosterChoisi] || 10;
  
      connexion.query('SELECT jetons FROM utilisateurs WHERE id = ?', [utilisateur_id], (err, results) => {
        if (err || results.length === 0) return res.redirect('/');
  
        const jetonsActuels = results[0].jetons;
        if (jetonsActuels < prix) {
          return res.send('<h1>🚫 Pas assez de jetons pour ouvrir ce booster !</h1><a href=\"/\">Retour</a>');
        }
  
        // Déduction des jetons
        connexion.query('UPDATE utilisateurs SET jetons = jetons - ? WHERE id = ?', [prix, utilisateur_id], (err2) => {
          if (err2) return res.redirect('/');
          req.session.utilisateur.jetons -= prix;
  
          const tirages = calculerCartes(boosterChoisi);
          const cartes = [];
          let restantes = tirages.length;
  
          function tirerTier() {
            const r = Math.random() * 100;
            if (r < 88.78) return 'T0';
            if (r < 98.78) return 'T1';
            if (r < 99.78) return 'T2';
            if (r < 99.98) return 'T3';
            return 'T4';
          }
  
          const champParTier = {
            T0: 'nb_exemplaires',
            T1: 'nb_brillante',
            T2: 'nb_alternative',
            T3: 'nb_noir_blanc',
            T4: 'nb_gold'
          };
  
          const prixParRareteEtTier = {
            1: { T0: 1, T1: 5, T2: 30, T3: 225, T4: 2250 },
            2: { T0: 2, T1: 10, T2: 60, T3: 450, T4: 4500 },
            3: { T0: 5, T1: 25, T2: 150, T3: 1125, T4: 11250 },
            4: { T0: 10, T1: 50, T2: 300, T3: 2250, T4: 22500 },
            5: { T0: 20, T1: 100, T2: 600, T3: 4500, T4: 45000 },
            6: { T0: 50, T1: 250, T2: 1500, T3: 11250, T4: 112500 }
          };
  
          // Pour chaque carte tirée : on récupère les infos et on la stocke
          tirages.forEach(tirage => {
            const { idCarte } = tirage;
            const tier = tirerTier();
  
            connexion.query('SELECT * FROM cartes WHERE id = ?', [idCarte], (err3, results3) => {
              if (!err3 && results3.length > 0) {
                const carte = results3[0];
                const rarete = carte.rarete;
                const champ = champParTier[tier];
                const prix = prixParRareteEtTier[rarete][tier];
  
                // Mise à jour BDD
                connexion.query(`
                  INSERT INTO collections (utilisateur_id, carte_id, ${champ})
                  VALUES (?, ?, 1)
                  ON DUPLICATE KEY UPDATE ${champ} = ${champ} + 1
                `, [utilisateur_id, idCarte]);
  
                // Ajout dans le rendu
                cartes.push({
                  nom: carte.nom,
                  description: carte.description,
                  rarete_id: rarete,
                  numero: carte.id,
                  tier: tier,
                  prix: prix
                });
              }
  
              restantes--;
              if (restantes === 0) {
                req.session.boosterEnCours = { cartes };
                renderBooster(req, res, cartes);
              }
            });
          });
        });
      });
    });
  
    // Finir le booster (vider la session)
    app.post('/finir-booster', (req, res) => {
      delete req.session.boosterEnCours;
      res.sendStatus(200);
    });
  
    // Fonction de rendu
    function renderBooster(req, res, cartes) {
      res.render('ouvrir-booster', {
        cartes,
        session: req.session,
        utilisateur: req.session.utilisateur,
        rarityLetters,
        color1,
        color2,
        color3,
        taillesSeries,
      });
    }
  };
  