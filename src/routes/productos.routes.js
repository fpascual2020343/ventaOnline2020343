const express = require('express');
const productosControlador = require('../controllers/productos.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

// RUTAS
const api = express.Router();

api.post('/agregarProductos', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], productosControlador.AgregarProductos);

api.put('/editarProductos/:idProducto', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], 
        productosControlador.editarProductos);

api.get('/obtenerProductos', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], productosControlador.obtenerProductos);

api.get('/obtenerProductosPorNombre', [md_autenticacion.Auth, md_roles.verCliente], productosControlador.obtenerProductoPorNombre);

module.exports = api;