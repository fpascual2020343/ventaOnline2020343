const express = require('express');
const controladorUsuario =require('../controllers/usuarios.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

//RUTAS
const api = express.Router();

api.post('/login', controladorUsuario.Login);
api.post('/agregarUsuarios', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.agregarUsuario);
api.put('/editarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.editarUsuarios);
api.delete('/eliminarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.eliminarUsuarios);

module.exports = api;