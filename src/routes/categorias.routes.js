const express = require('express');
const categoriasControlador = require('../controllers/categorias.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

// RUTAS
const api = express.Router();

api.post('/agregarCategoria' , [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], categoriasControlador.agregarCategoria);
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], 
        categoriasControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], 
            categoriasControlador.eliminarCategoriaDefaut);
api.get('/obtenerCategorias', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], 
        categoriasControlador.obtenerCategorias);

//Clientes 
api.get('/obtenerCategoriasExistentes', md_autenticacion.Auth, md_roles.verCliente, categoriasControlador.obtenerCategorias);

module.exports = api;

