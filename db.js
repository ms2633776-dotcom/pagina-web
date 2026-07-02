require("dotenv").config({
  path: __dirname + "/.env"
});

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => {
    console.log("✅ Conectado a Supabase PostgreSQL");
  })
  .catch((err) => {
    console.log("❌ Error conexión:", err);
  });

module.exports = pool;