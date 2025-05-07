// 📁 test-db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false
});

console.log("🚀 Test de connexion à la base PostgreSQL...");

pool.query('SELECT NOW()')
  .then(result => {
    console.log('🟢 Connexion réussie ! Heure serveur :', result.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Connexion échouée :', err.message);
  });

