const express = require('express');
const router = express.Router();

module.exports = (app, pool) => {
  app.get('/clicker', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.redirect('/connexion');

    try {
      const { rows: userRows } = await pool.query(
        'SELECT os, boost_clic_type, boost_clic_fin FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
      const user = userRows[0];

      const { rows: cartes } = await pool.query(`
        SELECT ea.emplacement, ea.tier, c.id, c.nom, c.image_url, c.rarete, c.description,
               col.nb_exemplaires, col.nb_brillante, col.nb_alternative, col.nb_noir_blanc, col.nb_gold
        FROM emplacements_actifs ea
        JOIN cartes c ON ea.carte_id = c.id
        JOIN collections col ON col.carte_id = c.id AND col.utilisateur_id = ea.utilisateur_id
        WHERE ea.utilisateur_id = $1
        ORDER BY ea.emplacement ASC
      `, [utilisateur.id]);

      // ✅ On injecte la propriété `index` à chaque carte (nécessaire pour le rendu EJS)
cartes.forEach(carte => {
  carte.index = carte.emplacement;
});

      // Calcul des os disponibles à collecter
const maintenant = new Date();
const { rows: userTimeRows } = await pool.query(
  'SELECT os, dernier_calcul_os FROM utilisateurs WHERE id = $1',
  [utilisateur.id]
);
const dernierCalcul = userTimeRows[0].dernier_calcul_os || maintenant;
const minutesPassees = Math.min(Math.floor((maintenant - dernierCalcul) / 1000 / 60), 24 * 60);

let osDisponibles = 0;

if (minutesPassees > 0) {
  const { rows: cartesProd } = await pool.query(`
    SELECT ea.amelioration_level, ea.tier, c.rarete
    FROM emplacements_actifs ea
    JOIN cartes c ON ea.carte_id = c.id
    WHERE ea.utilisateur_id = $1
  `, [utilisateur.id]);

  const prod = {
    1: [20, 50, 100, 150, 400],
    2: [30, 70, 150, 300, 700],
    3: [50, 100, 180, 450, 1000],
    4: [70, 140, 240, 550, 1300],
    5: [100, 200, 380, 600, 1600],
    6: [150, 300, 450, 850, 2000]
  };

  for (const carte of cartesProd) {
    const base = prod[carte.rarete]?.[carte.tier] || 0;
    const amelioration = 1 + (carte.amelioration_level || 0) * 0.1;
    const gain = (base * amelioration * minutesPassees) / 60;
    osDisponibles += gain;
  }

  osDisponibles = Math.floor(osDisponibles);
}

      

      res.render('clicker', {
        os: user.os,
        cartes: cartes,
        utilisateur: utilisateur,
        boostActif: user.boost_clic_type,
        boostFin: user.boost_clic_fin,
        osDisponibles: osDisponibles,
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
      console.error("❌ Erreur chargement clicker :", err);
      res.status(500).send("Erreur serveur");
    }
  });

  app.post('/clicker/collecter', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    try {
      const { rows: [user] } = await pool.query(
        'SELECT os, dernier_calcul_os FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
  
      const maintenant = new Date();
      const dernierCalcul = user.dernier_calcul_os || maintenant;
      const minutesPassees = Math.min(
        Math.floor((maintenant - dernierCalcul) / 1000 / 60),
        24 * 60 // max 24h
      );
      
      if (minutesPassees <= 0) {
        return res.json({ os: user.os });
      }
  
      // Récupérer les cartes assignées
      const { rows: cartes } = await pool.query(`
        SELECT ea.amelioration_level, ea.emplacement, ea.tier, c.rarete
        FROM emplacements_actifs ea
        JOIN cartes c ON ea.carte_id = c.id
        WHERE ea.utilisateur_id = $1
      `, [utilisateur.id]);
  
      // Tableau des valeurs de production par heure selon rareté et tier
      const prod = {
        1: [20, 50, 100, 150, 400],
        2: [30, 70, 150, 300, 700],
        3: [50, 100, 180, 450, 1000],
        4: [70, 140, 240, 550, 1300],
        5: [100, 200, 380, 600, 1600],
        6: [150, 300, 450, 850, 2000]
      };
  
      let osGagnes = 0;
      for (const carte of cartes) {
        const base = prod[carte.rarete]?.[carte.tier] || 0;
        const amelioration = 1 + (carte.amelioration_level || 0) * 0.1;
        const gain = (base * amelioration * minutesPassees) / 60;
        osGagnes += gain;
      }
      
      osGagnes = Math.round(osGagnes * 100) / 100; // pour arrondir à 2 décimales
      
      const ancienTotal = parseFloat(user.os) || 0;
      const nouveauTotal = Math.round((ancienTotal + osGagnes) * 100) / 100;
      
      await pool.query(
        'UPDATE utilisateurs SET os = $1, dernier_calcul_os = $2 WHERE id = $3',
        [nouveauTotal, maintenant, utilisateur.id]
      );
      
      console.log(`🧮 Collecte réussie : ${osGagnes} os gagnés (${nouveauTotal} total)`);
      
      res.json({ os: nouveauTotal, gain: osGagnes });
      
  
    } catch (err) {
      console.error("❌ Erreur lors de la collecte :", err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  
  app.post('/clicker/assigner', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const { carteId } = req.body;
    if (typeof carteId === 'undefined') {
      return res.status(400).json({ error: 'ID de carte manquant.' });
    }
  
    try {
      // Vérifier si 5 cartes sont déjà assignées
      const { rows: slots } = await pool.query(
        `SELECT emplacement FROM emplacements_actifs WHERE utilisateur_id = $1 ORDER BY emplacement ASC`,
        [utilisateur.id]
      );
  
      if (slots.length >= 5) {
        return res.status(400).json({ error: 'Vous avez déjà 5 cartes assignées.' });
      }
  
      // Trouver le 1er emplacement libre (entre 0 et 4)
      const used = slots.map(s => s.emplacement);
      let emplacement = 0;
      while (used.includes(emplacement)) emplacement++;
  
      // Récupérer les quantités possédées
      const { rows: [carte] } = await pool.query(`
        SELECT nb_exemplaires, nb_brillante, nb_alternative, nb_noir_blanc, nb_gold
        FROM collections
        WHERE utilisateur_id = $1 AND carte_id = $2
      `, [utilisateur.id, carteId]);
  
      if (!carte) {
        return res.status(400).json({ error: 'Carte non trouvée.' });
      }
  
      // Récupérer combien de fois cette carte est déjà assignée PAR TIER
      const { rows: dejaUtilisees } = await pool.query(`
        SELECT tier, COUNT(*)::int AS total
        FROM emplacements_actifs
        WHERE utilisateur_id = $1 AND carte_id = $2
        GROUP BY tier
      `, [utilisateur.id, carteId]);
  
      const tiersUtilises = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
      dejaUtilisees.forEach(row => {
        tiersUtilises[row.tier] = row.total;
      });
  
      // Déterminer le meilleur tier disponible encore utilisable
      const tiersPossibles = [
        { key: 'nb_gold', tier: 4 },
        { key: 'nb_noir_blanc', tier: 3 },
        { key: 'nb_alternative', tier: 2 },
        { key: 'nb_brillante', tier: 1 },
        { key: 'nb_exemplaires', tier: 0 }
      ];
  
      let tierAUtiliser = null;
  
      for (const t of tiersPossibles) {
        const possede = carte[t.key] || 0;
        const dejaPris = tiersUtilises[t.tier] || 0;
  
        if (possede > dejaPris) {
          tierAUtiliser = t.tier;
          break;
        }
      }
  
      if (tierAUtiliser === null) {
        return res.status(400).json({ error: 'Tous les exemplaires de cette carte sont déjà utilisés.' });
      }
  
      // ✅ Insertion
      await pool.query(`
        INSERT INTO emplacements_actifs (utilisateur_id, carte_id, emplacement, tier, start_timestamp)
        VALUES ($1, $2, $3, $4, NOW())
      `, [utilisateur.id, carteId, emplacement, tierAUtiliser]);
  
      res.json({ success: true, emplacement, tier: tierAUtiliser });
  
    } catch (err) {
      console.error("❌ Erreur assignation automatique :", err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  
  

  app.post('/clicker/cliquer/:slot', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const slot = parseInt(req.params.slot);
    if (isNaN(slot) || slot < 0 || slot > 4) {
      return res.status(400).json({ error: 'Emplacement invalide.' });
    }
  
    try {
      const now = new Date();
  
      // 🔁 Récupérer d'abord l'utilisateur pour éviter les conflits plus bas
      const { rows: [user] } = await pool.query(`
        SELECT os, boost_clic_type, boost_clic_fin FROM utilisateurs WHERE id = $1
      `, [utilisateur.id]);
  
      // Récupération de la carte assignée à ce slot
      const { rows } = await pool.query(`
        SELECT ea.id, ea.last_click, ea.tier, c.rarete
        FROM emplacements_actifs ea
        JOIN cartes c ON ea.carte_id = c.id
        WHERE ea.utilisateur_id = $1 AND ea.emplacement = $2
      `, [utilisateur.id, slot]);
  
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Aucune carte assignée à cet emplacement.' });
      }
  
      const carte = rows[0];
  
      // ✅ Vérification du cooldown AVEC accès à user.os
      const lastClick = carte.last_click ? new Date(carte.last_click) : null;
      if (lastClick && (now - lastClick) < 200) {
        return res.json({ os: user.os, gain: 0 }); // juste retour sans erreur
      }
  
      // Valeur de base
      const prod = {
        1: [20, 50, 100, 150, 400],
        2: [30, 70, 150, 300, 700],
        3: [50, 100, 180, 450, 1000],
        4: [70, 140, 240, 550, 1300],
        5: [100, 200, 380, 600, 1600],
        6: [150, 300, 450, 850, 2000]
      };
  
      const baseOs = prod[carte.rarete]?.[carte.tier] || 0;
      let gain = baseOs * 0.01; // à adapter
  
      if (user.boost_clic_type && user.boost_clic_fin && new Date(user.boost_clic_fin) > now) {
        if (user.boost_clic_type === 'x2') gain *= 2;
        if (user.boost_clic_type === 'x5') gain *= 5;
      }
  
      gain = Math.ceil(gain * 100) / 100;


      const ancienTotal = Number(user.os) || 0;
      const nouveauTotal = Math.round((ancienTotal + gain) * 100) / 100;
      console.log(`🧮 Clic → ${gain.toFixed(2)} os gagnés (nouveau total : ${nouveauTotal.toFixed(2)})`);
      if (isNaN(nouveauTotal)) {
        return res.status(500).json({ error: "Erreur : total os invalide (NaN)." });
      }



  
      await pool.query(
        'UPDATE utilisateurs SET os = $1 WHERE id = $2',
        [nouveauTotal, utilisateur.id]
      );
  
      await pool.query(
        'UPDATE emplacements_actifs SET last_click = $1 WHERE utilisateur_id = $2 AND emplacement = $3',
        [now, utilisateur.id, slot]
      );
  
      res.json({ os: Number(nouveauTotal.toFixed(2)) });
  
    } catch (err) {
      console.error("❌ Erreur lors du clic actif :", err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  
  app.post('/clicker/deplacer', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const { from, to } = req.body;
    if ([from, to].some(x => typeof x !== 'number' || x < 0 || x > 4)) {
      return res.status(400).json({ error: 'Slots invalides.' });
    }
  
    try {
      const { rows } = await pool.query(`
        SELECT id, emplacement FROM emplacements_actifs
        WHERE utilisateur_id = $1 AND emplacement IN ($2, $3)
      `, [utilisateur.id, from, to]);
  
      const carteFrom = rows.find(c => c.emplacement === from);
      const carteTo = rows.find(c => c.emplacement === to);
  
      if (!carteFrom) return res.status(400).json({ error: 'Pas de carte à déplacer.' });
  
      await pool.query('BEGIN');
  
      // Étape 1 : on libère temporairement la carte "from" en lui donnant une valeur hors plage dans une variable JS, mais on ne la met pas en BDD
      // Étape 2 : si une carte est en "to", on la place dans "from"
      if (carteTo) {
        await pool.query(`
          UPDATE emplacements_actifs SET emplacement = $1 WHERE id = $2
        `, [from, carteTo.id]);
      }
  
      // Étape 3 : on place la carteFrom dans l'emplacement "to"
      await pool.query(`
        UPDATE emplacements_actifs SET emplacement = $1 WHERE id = $2
      `, [to, carteFrom.id]);
  
      await pool.query('COMMIT');
      res.json({ success: true });
  
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error("❌ Erreur de déplacement :", err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  
  app.post('/clicker/acheter-boost', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const prix = 500;
    const type = 'x2'; // par défaut
    const dureeMinutes = 5;
  
    try {
      // Récupérer les infos actuelles
      const { rows: [user] } = await pool.query(
        'SELECT os FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
  
      if (!user || user.os < prix) {
        return res.json({ success: false, error: "Pas assez d'os" });
      }
  
      const nouvelleFin = new Date(Date.now() + dureeMinutes * 60000);
  
      // Débiter les os + activer le boost
      await pool.query(`
        UPDATE utilisateurs
        SET os = os - $1,
            boost_clic_type = $2,
            boost_clic_fin = $3
        WHERE id = $4
      `, [prix, type, nouvelleFin, utilisateur.id]);
  
      const { rows: [updated] } = await pool.query(
        'SELECT os FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
  
      res.json({ success: true, osRestants: updated.os });
  
    } catch (err) {
      console.error("❌ Erreur achat boost :", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  });
  
  app.post('/clicker/acheter-pieces', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const { prix, quantite } = req.body;
  
    if (!prix || !quantite || prix <= 0 || quantite <= 0) {
      return res.status(400).json({ error: 'Requête invalide.' });
    }
  
    try {
      const { rows: [user] } = await pool.query(
        'SELECT os FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
  
      if (!user || user.os < prix) {
        return res.json({ success: false, error: "Pas assez d'os." });
      }
  
      // Mise à jour : débiter les os et ajouter les pièces
      await pool.query(`
        UPDATE utilisateurs
        SET os = os - $1,
            jetons = COALESCE(jetons, 0) + $2
        WHERE id = $3
      `, [prix, quantite, utilisateur.id]);      
  
      const { rows: [updated] } = await pool.query(
        'SELECT os, jetons FROM utilisateurs WHERE id = $1',
        [utilisateur.id]
      );
  
      res.json({
        success: true,
        osRestants: updated.os,
        jetonsRestants: updated.jetons
      });
  
    } catch (err) {
      console.error("❌ Erreur achat pièces :", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  });
  
  app.post('/clicker/retirer/:slot', async (req, res) => {
    const utilisateur = req.session.utilisateur;
    if (!utilisateur) return res.status(401).json({ error: 'Non connecté.' });
  
    const slot = parseInt(req.params.slot);
    if (isNaN(slot) || slot < 0 || slot > 4) {
      return res.status(400).json({ error: 'Emplacement invalide.' });
    }
  
    try {
      await pool.query(`
        DELETE FROM emplacements_actifs
        WHERE utilisateur_id = $1 AND emplacement = $2
      `, [utilisateur.id, slot]);
  
      res.json({ success: true });
    } catch (err) {
      console.error("❌ Erreur lors du retrait de carte :", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  });
  

}