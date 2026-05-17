// ======================================
// IMPORTACIONES
// ======================================

require("dotenv").config();
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);

const express = require("express");
const path = require("path");
const cors = require("cors");
const pool = require("./db");

const app = express();


// ======================================
// MIDDLEWARES
// ======================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


// ======================================
// CARPETA FRONTEND
// ======================================

app.use(express.static(
  path.join(__dirname, "frontend")
));


// ======================================
// CONEXIÓN SUPABASE
// ======================================

pool.connect()
  .then(() => {

    console.log("✅ Conectado a Supabase PostgreSQL");

  })
  .catch((err) => {

    console.log("❌ Error conexión:", err);

  });


// ======================================
// RUTAS HTML
// ======================================

// INICIO
app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "frontend", "index.html")
  );

});


// MENU
app.get("/menu", (req, res) => {

  res.sendFile(
    path.join(__dirname, "frontend", "menu.html")
  );

});


// RESERVAS
app.get("/reservas", (req, res) => {

  res.sendFile(
    path.join(__dirname, "frontend", "reservas.html")
  );

});


// PROMOCIONES
app.get("/promociones", (req, res) => {

  res.sendFile(
    path.join(__dirname, "frontend", "promociones.html")
  );

});


// CONTACTO
app.get("/contacto", (req, res) => {

  res.sendFile(
    path.join(__dirname, "frontend", "contacto.html")
  );

});


// ======================================
// API CLIENTES
// ======================================

// OBTENER CLIENTES
app.get("/api/clientes", async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT * FROM clientes
      ORDER BY id_cliente ASC
    `);

    res.status(200).json(resultado.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error obteniendo clientes"
    });

  }

});


// REGISTRAR CLIENTE
app.post("/api/clientes", async (req, res) => {

  try {

    const {
      nombre,
      apellido,
      correo,
      telefono
    } = req.body;

    const resultado = await pool.query(`
      INSERT INTO clientes
      (
        nombre,
        apellido,
        correo,
        telefono
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [
      nombre,
      apellido,
      correo,
      telefono
    ]);

    res.status(201).json({

      mensaje: "Cliente registrado",

      cliente: resultado.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error registrando cliente"
    });

  }

});


// ======================================
// API PRODUCTOS
// ======================================

// OBTENER PRODUCTOS
app.get("/api/productos", async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT * FROM producto
    `);

    res.status(200).json(resultado.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error obteniendo productos"
    });

  }

});


// ======================================
// API VENTAS
// ======================================

// REGISTRAR VENTA
app.post("/api/ventas", async (req, res) => {

  try {

    const {

      total,
      id_cliente,
      id_pago,
      id_promocion,
      id_mesa,
      id_empleado

    } = req.body;


    const resultado = await pool.query(`
      INSERT INTO venta
      (
        fecha_venta,
        total,
        id_cliente,
        id_pago,
        id_promocion,
        id_mesa,
        id_empleado
      )
      VALUES
      (
        NOW(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
    `,
    [
      total,
      id_cliente,
      id_pago,
      id_promocion,
      id_mesa,
      id_empleado
    ]);

    res.status(201).json({

      mensaje: "Venta registrada",

      venta: resultado.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error registrando venta"
    });

  }

});


// OBTENER VENTAS
app.get("/api/ventas", async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT * FROM venta
      ORDER BY id_venta DESC
    `);

    res.status(200).json(resultado.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error obteniendo ventas"
    });

  }

});


// ======================================
// TEST DATABASE
// ======================================

app.get("/testdb", async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT NOW()
    `);

    res.json({

      mensaje: "Base de datos conectada",

      hora: resultado.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error conectando con Supabase"
    });

  }

});

app.get("/prueba", (req, res) => {

  res.json({
    mensaje: "API funcionando"
  });

});

// ======================================
// ERROR 404
// ======================================

app.use((req, res) => {

  res.status(404).send(`

    <h1>404 - Página no encontrada</h1>

  `);

});


// ======================================
// SERVIDOR
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`
========================================
☕ BUEN GUSTO CAFETERÍA
🚀 Servidor funcionando correctamente
🌐 http://localhost:${PORT}
========================================
  `);

});