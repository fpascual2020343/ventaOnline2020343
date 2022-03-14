const Usuario = require('../models/usuarios.models');
const Producto = require('../models/productos.model');
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

            if (parametros.nombre && parametros.apellido && parametros.email && parametros.usuario && parametros.rol) {

                modeloUsuarios.usuario = parametros.usuario;
                modeloUsuarios.nombre = parametros.nombre;
                modeloUsuarios.apellido = parametros.apellido;
                modeloUsuarios.email = parametros.email;
                modeloUsuarios.rol = parametros.rol;
                modeloUsuarios.totalCarrito = 0;

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

        }

    })

}

function editarUsuariosAdminoCliente(req, res) {

    var parametros = req.body;
    var idUser = req.params.idUsuario;

    delete parametros.password;

    Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {

        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
        if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al editar el usuario' });

        return res.status(200).send({ Usuario: usuarioEditado });
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

function editarCuentaCliente(req, res) {

    var parametros = req.body;
    var usuarioLogeado = req.params.idUsuario;

    delete parametros.password;
    delete parametros.rol;

    if (req.user.sub !== usuarioLogeado) {
        return res.status(500).send({ mensaje: 'No tiene los permisos para editar otro usuario que no sea el suyo' });
    } else {

        Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true }, (err, usuarioEditado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

            return res.status(200).send({ usuario: usuarioEditado });
        })
    }
}

function eliminarCuentaCliente(req, res) {

    var usuarioLogeado = req.params.idUsuario;

    if (req.user.sub !== usuarioLogeado) {
        return res.status(500).send({ mensaje: 'No tiene los permisos para eliminar otro usuario que no sea el suyo' });
    } else {

        Usuario.findByIdAndDelete(usuarioLogeado, (err, usuarioClienteEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!usuarioClienteEliminado) return res.status(500).send({ mensaje: 'Error al elimiar el Usuario' });

            return res.status(200).send({ usuario: usuarioClienteEliminado });
        })
    }

}

function agregarProductoCarrito(req, res) {
    const parametros = req.body;

    Producto.findOne({ producto: parametros.producto }, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion producto' });
        if (!productoEncontrado) return res.status(500).send({ mensaje: 'Erorr al buscar el producto' });

        Usuario.findByIdAndUpdate(req.user.sub, {
            $push: {
                carrito: {
                    nombreProducto: parametros.producto,
                    cantidadComprada: parametros.cantidad, precioUnitario: productoEncontrado.precio, subTotal: productoEncontrado.precio * parametros.cantidad
                }
            }
        }, { new: true },
            (err, productoAgregadoCarrito) => {

                if (err) return res.status(500).send({ mensaje: 'Error en  la peticion del carrito' })
                if (!productoAgregadoCarrito) return res.status(500).send({ mensaje: 'Error al agregar el producto al carrito' });

                let totalCarritoLocal = 0;
                for (let i = 0; i < productoAgregadoCarrito.carrito.length; i++) {
                    totalCarritoLocal += productoAgregadoCarrito.carrito[i].subTotal;
                }

                Usuario.findByIdAndUpdate(req.user.sub, { totalCarrito: totalCarritoLocal }, { new: true },
                    (err, totalActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion total Carrito' });
                        if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito' });

                        return res.status(200).send({ usuario: totalActualizado })
                    })

            })
    })

}

function eliminarProductoCarrito(req, res) {

    var productoCarritoId = req.params.idProducto;

    Usuario.findOneAndUpdate({ carrito: { $elemMatch: { _id: productoCarritoId } } },
        { $pull: { carrito: { _id: productoCarritoId } } }, { new: true }, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el producto del carrito' });

            let totalCarritoLocal = 0;
                for (let i = 0; i < productoEliminado.carrito.length; i++) {
                    totalCarritoLocal += productoEliminado.carrito[i].subTotal;
                }

                Usuario.findByIdAndUpdate(req.user.sub, { totalCarrito: totalCarritoLocal }, { new: true },
                    (err, totalActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion total Carrito' });
                        if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito' });

                        return res.status(200).send({ usuario: totalActualizado })
                    })

        })


}

function visualizarCarrito(req, res) {

    var logeado = req.user.sub;
    Usuario.findById(logeado , (err, productosEncontrados)=>{

        let productos = []
        for(let i = 0; i < productosEncontrados.carrito.length; i++){
            
            productos.push(`producto: ${productosEncontrados.carrito[i].nombreProducto} 
            cantidad:${ productosEncontrados.carrito[i].cantidadComprada}  
            precio: Q.${productosEncontrados.carrito[i].precioUnitario}  
            subtotal: Q.${productosEncontrados.carrito[i].subTotal}`)
           
        }
        let TotalCarrito = []
        for(let i = 0; i < productosEncontrados.carrito.length; i++){
            
            TotalCarrito.push(`total: Q.${productosEncontrados.totalCarrito}`)
           
        }
        return res.status(200).send({Carrito: productos,TotalCarrito})
    })
   
}



module.exports = {
    registrarAdminDefault,
    Login,
    agregarUsuario,
    editarUsuariosAdminoCliente,


    editarUsuarios,
    eliminarUsuarios,

    editarCuentaCliente,
    eliminarCuentaCliente,

    agregarProductoCarrito,
    eliminarProductoCarrito,
    visualizarCarrito
}