// =========================
// 📁 app.js – Serveur principal Teckel B02
// =========================

// === Importations ===
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { calculerCartes } = require("./script/probabilite");
const { DateTime } = require("luxon");

// === App et port ===
const app = express();
const port = 3000;

// === Configuration générale ===
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// === Sessions ===
app.use(session({
  secret: 'un_secret_de_malade',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 90 } // 90 jours
}));

// === Connexion à la base de données ===
const connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testcard"
});

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
require("./routes/auth")(app, connexion, bcrypt);

// 🏠 Accueil & Jetons quotidiens
require("./routes/accueil")(app, connexion, DateTime);
require("./routes/gagnerJetons")(app, connexion, DateTime);

// 📦 Boosters (tirage, affichage)
require("./routes/booster")(app, connexion, calculerCartes, prixBoosters, color1, color2, color3, rarityLetters);

// 🗂️ Collection & Transformations
require("./routes/collection")(app, connexion, rarityLetters, color1, color2);
require("./routes/transformations")(app, connexion);

// 🛒 Marché & Vente
require("./routes/marche")(app, connexion, rarityNames, rarityLetters, color1, color2);
require("./routes/acheter")(app, connexion,);
require("./routes/ventes")(app, connexion);

// === Lancer le serveur ===
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
