const express = require('express');
const facturaControlador = require('../controllers/factura.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

// RUTAS
const api = express.Router();

api.get('/obtenerFactura', [md_autenticacion.Auth, md_roles.verCliente], facturaControlador.carritoAFactura);

module.exports = api;