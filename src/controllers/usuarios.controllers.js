const Usuario = require('../models/usuarios.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function registrarAdminDefault(req, res) {

    var modeloUsuario = new Usuario();

    Usuario.find({ rol: "Admin" }, (err, existente) => {

        if (existente.length > 0) {
            console.log("El  admin ya esta registrado");
        } else {

            modeloUsuario.usuario = 'Admin';
            modeloUsuario.rol = 'Admin';
            modeloUsuario.nombre = 'Admin';
            modeloUsuario.apellido = 'Admin';
            modeloUsuario.email = 'Admin';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {

                modeloUsuario.password = passwordEncriptada;

                modeloUsuario.save((err, usuarioGuardado) => {

                    if (err) console.log("Error en la peticion")
                    if (!usuarioGuardado) console.log("Error al guardar el admin");

                    console.log({ Usuario: usuarioGuardado });
                })
            })
        }

    })
}

function Login(req, res) {

    var parametros = req.body;

    Usuario.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500).send({ mensaje: 'La contrasena no coincide.' })
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'El usuario, no se ha podido identificar' })
        }
    })
}


function agregarUsuario(req, res) {

    var parametros = req.body;
    var modeloUsuarios = new Usuario();

    Usuario.find({ email: parametros.email }, (err, existente1) => {

        if (existente1.length > 0) {

            return res.status(200).send({ mensaje: "Este correo ya esta en uso" })

        } else {

            Usuario.find({ usuario: parametros.usuario }, (err, existente2) => {

                if (parametros.nombre && parametros.apellido && parametros.email && parametros.usuario && parametros.rol) {

                    modeloUsuarios.nombre = parametros.nombre;
                    modeloUsuarios.apellido = parametros.apellido;
                    modeloUsuarios.email = parametros.email;
                    modeloUsuarios.usuario = parametros.usuario;
                    modeloUsuarios.rol = parametros.rol;

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {

                        modeloUsuarios.password = passwordEncriptada;

                        modeloUsuarios.save((err, usuarioGuardado) => {

                            if (err) return res.status(404).send({ mensaje: "Error en la peticion" })
                            if (!usuarioGuardado) return res.status(404).send({ mensaje: "Error al guardar al usuario" });

                            return res.status(200).send({ Usuario: usuarioGuardado });
                        })
                    })

                } else {
                    return res.status(400).send({ mensaje: "Debe de agregar los parametros Obligatorios" });
                }

            })

        }

    })

}

function editarUsuarios(req, res) {

    var parametros = req.body;
    var idUser = req.params.idUsuario;

    delete parametros.password;


    Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {

        if (err) return res.status(404).send({ mensaje: "Error en la peticion" })
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al encontrar al usuario" });

        if (usuarioEncontrado.rol !== "Cliente") {

            return res.status(500).send({ mensaje: 'Solo puede editar los usuarios que tengan un rol de Cliente' })

        } else {

            Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {

                if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al editar el usuario' });

                return res.status(200).send({ Usuario: usuarioEditado });
            })

        }

    })

}

function eliminarUsuarios(req, res) {

    var idUser = req.params.idUsuario;


    Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {

        if (err) return res.status(404).send({ mensaje: "Error en la peticion" })
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al encontrar al usuario" });

        if (usuarioEncontrado.rol !== "Cliente") {

            return res.status(500).send({ mensaje: 'Solo puede eliminar los usuarios que tengan un rol de Cliente' })

        } else {

            Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {

                if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el usuario' });

                return res.status(200).send({ Usuario: usuarioEliminado });
            })

        }

    })

}


module.exports = {
    registrarAdminDefault,
    Login,
    agregarUsuario,
    editarUsuarios,
    eliminarUsuarios
}