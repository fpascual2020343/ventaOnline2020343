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
api.put('/editarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.editarUsuarios);
api.delete('/eliminarUsuarios/:idUsuario', [md_autenticacion.Auth, md_roles.ADMIN], controladorUsuario.eliminarUsuarios);
//Clientes
api.put('/editarCliente/:idUsuario', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.editarCuentaCliente);
api.delete('/eliminarCliente/:idUsuario', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.eliminarCuentaCliente);
api.put('/agregarCarrito', [md_autenticacion.Auth, md_roles.verCliente],controladorUsuario.agregarProductoCarrito);
api.put('/eliminarProductoCarrito/:idProducto', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.eliminarProductoCarrito);
api.get('/verCarrito', [md_autenticacion.Auth, md_roles.verCliente], controladorUsuario.visualizarCarrito);


module.exports = api;