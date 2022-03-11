const express = require('express');
const productosControlador = require('../controllers/productos.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

// RUTAS
const api = express.Router();

api.post('/agregarProductos', [md_autenticacion.Auth, md_roles.ADMIN], productosControlador.AgregarProductos);

module.exports = api;