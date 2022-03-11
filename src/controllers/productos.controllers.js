var Productos = require('../models/productos.model');


// AGREGAR PRODUCTOS
function AgregarProductos(req, res) {

    var parametros = req.body;
    var modeloProductos = new Productos();

    if (parametros.nombre && parametros.cantidad && parametros.precio && parametros.proveedor) {

        modeloProductos.nombre = parametros.nombre;
        modeloProductos.proveedor = parametros.proveedor;
        modeloProductos.cantidad = parametros.cantidad;
        modeloProductos.precio = parametros.precio;

        modeloProductos.save((err, productoGuardado) => {

            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoGuardado) return res.status(404).send({ mensaje: 'Error al guardar el Producto' });

            return res.send({ productos: productoGuardado });
        });

    } else {
        return res.send({ mensaje: "Debe enviar los parametros obligatorios." })
    }

}

module.exports = {
    AgregarProductos
}