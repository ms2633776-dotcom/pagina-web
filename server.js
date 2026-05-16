// server.js

const express = require("express");
const path = require("path");

const app = express();


// ======================================
// PUERTO PARA RENDER
// ======================================

const PORT = process.env.PORT || 3000;


// ======================================
// MIDDLEWARES
// ======================================

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


// ======================================
// CARPETA FRONTEND
// ======================================

app.use(express.static(path.join(__dirname, "frontend")));


// ======================================
// RUTAS HTML
// ======================================

// INICIO
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// MENU
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "menu.html"));
});

// RESERVAS
app.get("/reservas", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "reservas.html"));
});

// PROMOCIONES
app.get("/promociones", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "promociones.html"));
});

// CONTACTO
app.get("/contacto", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "contacto.html"));
});


// ======================================
// PRODUCTOS TEMPORALES
// ======================================

const productos = [

  {
    id: 1,
    nombre: "Latte Vainilla",
    precio: 12,
    categoria: "Café",
    imagen: "img/cafes/latte.jpg"
  },

  {
    id: 2,
    nombre: "Capuccino",
    precio: 10,
    categoria: "Café",
    imagen: "img/cafes/capuccino.jpg"
  },

  {
    id: 3,
    nombre: "Brownie Premium",
    precio: 8,
    categoria: "Postre",
    imagen: "img/postres/brownie.jpg"
  }

];


// ======================================
// API PRODUCTOS
// ======================================

app.get("/api/productos", (req, res) => {

  res.status(200).json(productos);

});


// ======================================
// PEDIDOS
// ======================================

let pedidos = [];


// REGISTRAR PEDIDO
app.post("/api/pedidos", (req, res) => {

  const {
    cliente,
    productos,
    total
  } = req.body;

  const nuevoPedido = {

    id: pedidos.length + 1,

    cliente,

    productos,

    total,

    fecha: new Date()

  };

  pedidos.push(nuevoPedido);

  console.log("=================================");
  console.log("🛒 NUEVO PEDIDO");
  console.log(nuevoPedido);
  console.log("=================================");

  res.status(201).json({

    mensaje: "Pedido registrado correctamente",

    pedido: nuevoPedido

  });

});


// OBTENER PEDIDOS
app.get("/api/pedidos", (req, res) => {

  res.status(200).json(pedidos);

});


// ======================================
// RESERVAS
// ======================================

let reservas = [];


// REGISTRAR RESERVA
app.post("/api/reservas", (req, res) => {

  const {
    nombre,
    personas,
    fecha,
    hora
  } = req.body;

  const nuevaReserva = {

    id: reservas.length + 1,

    nombre,

    personas,

    fecha,

    hora

  };

  reservas.push(nuevaReserva);

  console.log("=================================");
  console.log("📅 NUEVA RESERVA");
  console.log(nuevaReserva);
  console.log("=================================");

  res.status(201).json({

    mensaje: "Reserva registrada correctamente",

    reserva: nuevaReserva

  });

});


// OBTENER RESERVAS
app.get("/api/reservas", (req, res) => {

  res.status(200).json(reservas);

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
// INICIAR SERVIDOR
// ======================================

app.listen(PORT, () => {

  console.log(`
========================================
☕ BUEN GUSTO CAFETERÍA
🚀 Servidor funcionando correctamente
🌐 http://localhost:${PORT}
========================================
  `);

});