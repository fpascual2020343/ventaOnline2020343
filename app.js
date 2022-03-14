const express = require('express');
const app = express();
const cors = require('cors');

// IMPORTACION RUTAS
const usuarioRoutes = require('./src/routes/usuarios.routes');
const productosRoutes = require('./src/routes/productos.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');
const facturaRoutes = require('./src/routes/factura.routes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/controlEmpresas
app.use('/api', usuarioRoutes, productosRoutes, categoriasRoutes, facturaRoutes);

module.exports = app;