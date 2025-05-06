module.exports = (app, pool, bcrypt) => {
  const crypto = require("crypto");

  app.get("/connexion", (req, res) => {
    if (!req.session.csrf_token) {
      req.session.csrf_token = crypto.randomBytes(32).toString("hex");
    }
    res.render("connexion", { csrf_token: req.session.csrf_token });
  });

  app.post("/connexion", (req, res) => {
    const { email, motdepasse } = req.body;

    pool.query("SELECT * FROM utilisateurs WHERE email = $1", [email], async (err, result) => {
      if (err) throw err;
      if (result.rows.length === 0) return res.send("Aucun compte avec cet email");

      const utilisateur = result.rows[0];
      const passwordOK = await bcrypt.compare(motdepasse, utilisateur.mot_de_passe);
      if (!passwordOK) return res.send("Mot de passe incorrect");

      req.session.utilisateur = {
        id: utilisateur.id,
        pseudo: utilisateur.pseudo,
        email: utilisateur.email,
        jetons: utilisateur.jetons,
      };

      res.redirect("/");
    });
  });

  app.post("/inscription", async (req, res) => {
    const { pseudo, email, motdepasse } = req.body;
    const motdepasseHashe = await bcrypt.hash(motdepasse, 10);

    pool.query(
      "INSERT INTO utilisateurs (pseudo, email, mot_de_passe, jetons) VALUES ($1, $2, $3, 100)",
      [pseudo, email, motdepasseHashe],
      (err) => {
        if (err) {
          console.error(err);
          return res.send("Erreur : email ou pseudo déjà utilisé.");
        }
        res.redirect("/connexion");
      }
    );
  });
};
