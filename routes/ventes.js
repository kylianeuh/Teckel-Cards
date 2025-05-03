module.exports = (app, connexion) => {
    // Vendre une carte directement
    app.post('/vendre-direct', (req, res) => {
      const { carte_id, quantite, type } = req.body;
      const utilisateur_id = req.session.utilisateur.id;
      const quantiteInt = parseInt(quantite);
    
      const typesAutorises = ['nb_exemplaires', 'nb_brillante', 'nb_alternative', 'nb_noir_blanc', 'nb_gold'];
    
      if (!quantiteInt || quantiteInt <= 0) {
        return res.status(400).send('Quantité invalide');
      }
    
      if (!typesAutorises.includes(type)) {
        return res.status(400).send('Type de carte non pris en charge');
      }
    
      connexion.query(`
        SELECT nb_exemplaires, nb_brillante, nb_alternative, nb_noir_blanc, nb_gold, cartes.rarete
        FROM collections
        JOIN cartes ON cartes.id = collections.carte_id
        WHERE collections.utilisateur_id = ? AND collections.carte_id = ?
      `, [utilisateur_id, carte_id], (err, results) => {
        if (err || results.length === 0) return res.status(500).send('Erreur serveur');
    
        const carte = results[0];
        const possedees = carte[type];
    
        if (possedees < quantiteInt) {
          return res.status(400).send(`Pas assez de cartes (${type})`);
        }
    
        const {
          prixVente,
          rarityNames,
          rarityLetters,
          color1,
          color2,
          color3,
          mapTier
        } = require('../script/constantesCartes');
    

    
        const tier = mapTier[type];
        const prixUnitaire = prixVente[carte.rarete][tier];
        const montantTotal = prixUnitaire * quantiteInt;
    
        connexion.query(`
          UPDATE collections
          SET ${type} = ${type} - ?
          WHERE utilisateur_id = ? AND carte_id = ?
        `, [quantiteInt, utilisateur_id, carte_id], (err2) => {
          if (err2) return res.status(500).send('Erreur lors de la mise à jour');
    
          connexion.query(`
            UPDATE utilisateurs
            SET jetons = jetons + ?
            WHERE id = ?
          `, [montantTotal, utilisateur_id], (err3) => {
            if (err3) return res.status(500).send('Erreur crédit jetons');
    
            req.session.utilisateur.jetons += montantTotal;
            return res.status(200).send('Vente réussie');
          });
        });
      });
    });
    
  
    // Mettre en vente au marché
    app.post('/mettre-en-vente', (req, res) => {
      const { carte_id, quantite, type } = req.body;
      const utilisateur_id = req.session.utilisateur.id;
      const quantiteInt = parseInt(quantite);
  
      if (!quantiteInt || quantiteInt <= 0) {
        return res.status(400).send('Quantité invalide');
      }
  
      connexion.query(`
        SELECT nb_exemplaires, nb_brillante, cartes.rarete
        FROM collections
        JOIN cartes ON cartes.id = collections.carte_id
        WHERE collections.utilisateur_id = ? AND collections.carte_id = ?
      `, [utilisateur_id, carte_id], (err, results) => {
        if (err || results.length === 0) return res.status(500).send('Erreur serveur');
  
        const carte = results[0];
  
        if ((type === 'nb_exemplaires' && carte.nb_exemplaires < quantiteInt) ||
            (type === 'nb_brillante' && carte.nb_brillante < quantiteInt)) {
          return res.status(400).send('Pas assez de cartes pour vendre');
        }
  
        const prixSuggestion = {
          1: 1, 2: 2, 3: 6, 4: 15, 5: 30, 6: 150
        };
  
        const prixParUnite = prixSuggestion[carte.rarete] || 10;
  
        connexion.query(`
          INSERT INTO ventes (vendeur_id, carte_id, quantite, prix_par_unite, type)
          VALUES (?, ?, ?, ?, ?)
        `, [utilisateur_id, carte_id, quantiteInt, prixParUnite, type], (err2) => {
          if (err2) return res.status(500).send('Erreur insertion');
  
          connexion.query(`
            UPDATE collections
            SET ${type} = ${type} - ?
            WHERE utilisateur_id = ? AND carte_id = ?
          `, [quantiteInt, utilisateur_id, carte_id], (err3) => {
            if (err3) return res.status(500).send('Erreur mise à jour collection');
            return res.status(200).send('Carte mise en vente');
          });
        });
      });
    });
  
    // Acheter une carte sur le marché
    app.post('/acheter', (req, res) => {
      const { vente_id } = req.body;
      const acheteur_id = req.session.utilisateur.id;
  
      connexion.query(`
        SELECT v.*, u.pseudo AS vendeur_pseudo
        FROM ventes v
        JOIN utilisateurs u ON u.id = v.vendeur_id
        WHERE v.id = ?
      `, [vente_id], (err, results) => {
        if (err || results.length === 0) return res.redirect('/marche');
  
        const vente = results[0];
        if (vente.vendeur_id === acheteur_id) {
          return res.send('<h1>🚫 Tu ne peux pas acheter ta propre carte !</h1><a href=\"/marche\">Retour</a>');
        }
  
        connexion.query('SELECT jetons FROM utilisateurs WHERE id = ?', [acheteur_id], (err2, resultJetons) => {
          if (err2 || resultJetons.length === 0) return res.redirect('/marche');
  
          const jetonsAcheteur = resultJetons[0].jetons;
          if (jetonsAcheteur < vente.prix_par_unite) {
            return res.send('<h1>🚫 Pas assez de jetons !</h1><a href=\"/marche\">Retour</a>');
          }
  
          // Débit acheteur
          connexion.query('UPDATE utilisateurs SET jetons = jetons - ? WHERE id = ?', [vente.prix_par_unite, acheteur_id]);
          // Crédit vendeur
          connexion.query('UPDATE utilisateurs SET jetons = jetons + ? WHERE id = ?', [vente.prix_par_unite, vente.vendeur_id]);
          // Ajouter la carte à l'acheteur
          connexion.query(`
            INSERT INTO collections (utilisateur_id, carte_id, nb_exemplaires, nb_brillante)
            VALUES (?, ?, 1, 0)
            ON DUPLICATE KEY UPDATE nb_exemplaires = nb_exemplaires + 1
          `, [acheteur_id, vente.carte_id]);
  
          // Mise à jour de la vente
          if (vente.quantite > 1) {
            connexion.query('UPDATE ventes SET quantite = quantite - 1 WHERE id = ?', [vente_id]);
          } else {
            connexion.query('DELETE FROM ventes WHERE id = ?', [vente_id]);
          }
  
          req.session.utilisateur.jetons -= vente.prix_par_unite;
          return res.redirect('/marche?success=1');
        });
      });
    });
  };
  