// =========================
// 📁 app.js – Serveur principal Teckel B02 clesteckelouquoila
// =========================

// === Importations ===
const express = require("express");
// const mysql = require("mysql2");
const pool = require('./db'); // Connexion PostgreSQL
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { calculerCartes } = require("./script/probabilite");
const { DateTime } = require("luxon");

console.log("🚀 Test de connexion à la base PostgreSQL...");

pool.query('SELECT * FROM utilisateurs WHERE id = $1', [2])
  .then(result => {
    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur avec l\'ID 2 trouvé.');
    } else {
      console.log('👤 Utilisateur ID 2 :', result.rows[0]);
    }
  })
  .catch(err => {
    console.error('❌ Erreur PostgreSQL :', err.message);
  });


// === App et port ===
const app = express();

// === Configuration générale ===
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// === Sessions ===
app.use(session({
  secret: 'clesteckelouquoila',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 90 } // 90 jours
}));

// === Connexion à la base de données ===
// const connexion = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "testcard"
// });
require("./routes/auth")(app, pool, bcrypt);

// === Données globales ===
const rarityNames = { 1: "Cuivre", 2: "Titane", 3: "Platine", 4: "Améthyste", 5: "Rubis", 6: "Or" };
const rarityLetters = { 1: "C", 2: "T", 3: "P", 4: "A", 5: "R", 6: "G" };
const color1 = { 1: "#b87333", 2: "#b0c4de", 3: "#e5e4e2", 4: "#9966cc", 5: "#e0115f", 6: "#ffd700" };
const color2 = { 1: "#e6c3a1", 2: "#e6e6f0", 3: "#fafafa", 4: "#d1b3e0", 5: "#f8c2d4", 6: "#fff9d6" };
const color3 = { 1: "rgba(184, 115, 51, 0.8)", 2: "rgba(176, 196, 222, 0.8)", 3: "rgba(229, 228, 226, 0.8)", 4: "rgba(153, 102, 204, 0.8)", 5: "rgba(224, 17, 95, 0.8)", 6: "rgba(255, 215, 0, 0.8)" };
const prixBoosters = { 1: 4, 2: 8, 3: 15, 4: 35 };

// === Middleware d’authentification ===
function verifierConnexion(req, res, next) {
  if (req.session.utilisateur) next();
  else res.redirect("/connexion");
}

// === Routes ===

// 🧑‍💼 Connexion & Inscription
require("./routes/auth")(app, pool, bcrypt);

// 🏠 Accueil & Jetons quotidiens
require("./routes/accueil")(app, pool, DateTime);
require("./routes/gagnerJetons")(app, pool, DateTime);

// 📦 Boosters (tirage, affichage)
require("./routes/booster")(app, pool, calculerCartes, prixBoosters, color1, color2, color3, rarityLetters);

// 🗂️ Collection & Transformations
require("./routes/collection")(app, pool, rarityLetters, color1, color2);
require("./routes/transformations")(app, pool);

// 🛒 Marché & Vente
require("./routes/marche")(app, pool, rarityNames, rarityLetters, color1, color2);
require("./routes/acheter")(app, pool);
require("./routes/ventes")(app, pool);

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});