const mysql = require('mysql2');

// Connexion à ta base
const connexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // mets ton utilisateur MySQL ici
  password: '',         // mets ton mot de passe ici (vide si aucun)
  database: 'testcard'  // le nom de ta base
});

// Fonction pour récupérer les cartes d'un utilisateur
function getCartesUtilisateur(utilisateurId) {
  const requete = `
    SELECT * FROM vue_collections_utilisateurs
    WHERE utilisateur_id = ?;
  `;

  connexion.query(requete, [utilisateurId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des cartes :', err);
      return;
    }

    console.log(`📚 Cartes de l'utilisateur ${utilisateurId} :`);
    results.forEach(carte => {
      console.log(`- Carte ID ${carte.carte_id} : ${carte.nom_carte}`);
    });
  });
}

// Connexion et utilisation
connexion.connect(err => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
    return;
  }

  console.log('✅ Connecté à MySQL');

  // TEST : récupérer les cartes de l'utilisateur ID 6
  getCartesUtilisateur(6);
});
