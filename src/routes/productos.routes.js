const express = require('express');
const productosControlador = require('../controllers/productos.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

// RUTAS
const api = express.Router();
//Admin
api.post('/agregarProductos', [md_autenticacion.Auth, md_roles.ADMIN], productosControlador.AgregarProductos);
api.put('/editarProductos/:idProducto', [md_autenticacion.Auth, md_roles.ADMIN], productosControlador.editarProductos);
api.get('/obtenerProductos', [md_autenticacion.Auth, md_roles.ADMIN], productosControlador.obtenerProductos);
api.put('/controlStock/:idProducto', [md_autenticacion.Auth, md_roles.ADMIN], productosControlador.stockProducto);
//Cliente
api.get('/obtenerProductosPorNombre', [md_autenticacion.Auth, md_roles.verCliente], productosControlador.obtenerProductoPorNombre);
api.post('/obtenerProductosPorCategoria', [md_autenticacion.Auth, md_roles.verCliente], productosControlador.obtenerProductosPorCategoria);

module.exports = api;