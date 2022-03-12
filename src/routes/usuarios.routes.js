const express = require('express');
const controladorUsuario =require('../controllers/usuarios.controllers');

const md_autenticacion = require('../middlewares/auteticacion');
const md_roles = require('../middlewares/roles');

//RUTAS
const api = express.Router();
api.post('/login', controladorUsuario.Login);
//Admin
api.post('/agregarUsuarios', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.agregarUsuario);
api.put('/editarUsuariosAdminOCliente/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.editarUsuariosAdminoCliente);
//Administradores
api.put('/editarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], controladorUsuario.editarUsuarios);
api.delete('/eliminarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN, md_roles.verAdministrador], controladorUsuario.eliminarUsuarios);
//Clientes
api.put('/editarCliente/:idUsuario', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.editarCuentaCliente);
api.delete('/eliminarCliente/:idUsuario', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.eliminarCuentaCliente);

module.exports = api;