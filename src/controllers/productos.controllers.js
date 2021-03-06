var Productos = require('../models/productos.model');
var Categoria = require('../models/categorias.model');


// AGREGAR PRODUCTOS
function AgregarProductos(req, res) {

    var parametros = req.body;
    var modeloProductos = new Productos();

    if (parametros.nombre && parametros.cantidad && parametros.precio && parametros.proveedor) {

        Categoria.findOne({ nombre: parametros.nombre }, (err, categoriaEncontrada) => {

            if (err) return res.status(400).send({ mensaje: 'Erorr en la peticion de obtener categoria' });
            if (!categoriaEncontrada) return res.status(400).send({ mensaje: 'Error al obtener la categoria' });

            modeloProductos.producto = parametros.producto;
            modeloProductos.proveedor = parametros.proveedor;
            modeloProductos.cantidad = parametros.cantidad;
            modeloProductos.precio = parametros.precio;
            modeloProductos.idCategoria = categoriaEncontrada._id;

            modeloProductos.save((err, productoGuardado) => {

                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!productoGuardado) return res.status(404).send({ mensaje: 'Error al guardar el Producto' });

                return res.status(200).send({ productos: productoGuardado });
            });

        })

    } else {
        return res.send({ mensaje: "Debe enviar los parametros obligatorios." })
    }

}

function editarProductos(req, res) {

    var parametros = req.body;
    var productoId = req.params.idProducto;

    Productos.findByIdAndUpdate(productoId, parametros, { new: true }, (err, productoEditado) => {

        if (err) return res.status(400).send({ mensaje: "Error en la peticion" });
        if (!productoEditado) return res.status(404).send({ mensaje: "Error al editar el producto" });

        return res.status(200).send({ Producto: productoEditado });
    })

}

function obtenerProductos(req, res) {

    Productos.find({}, (err, productoEncontrado) => {
        if (err) return res.status(400).send({ mensaje: "Error en la peticion" });
        if (!productoEncontrado) return res.status(404).send({ mensaje: "Error al encontrar los productos" });

        return res.status(200).send({ productos: productoEncontrado });
    }).populate("idCategoria", "nombre");

}

function obtenerProductoPorNombre(req, res) {

    var parametros = req.body;

    Productos.find({ producto: { $regex: parametros.producto, $options: "i" } }, (err, productoEncontrado) => {

        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });

        if (!productoEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el producto' })

        return res.status(200).send({ producto: productoEncontrado })

    }).populate('idCategoria', 'nombre');

}

function obtenerProductosPorCategoria(res, req) {

    var parametros = req.body;

    Categoria.findOne({ nombre: parametros.categoria }, (err, categoriaEncontrada) => {

        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
        if (!categoriaEncontrada) return res.status(500).send({ mensaje: 'Error al obtener la categoria' });

        Productos.find({ idCategoria: categoriaEncontrada._id, parametros}, (err, productosEncontrada) => {

            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!productosEncontrada) return res.status(500).send({ mensaje: 'Error al obtener los productos' });

            return res.status(200).send({ producto: productosEncontrada});
        })
    })
}

// Incrementar stock productos
function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findByIdAndUpdate(productoId, { $inc : {cantidad : parametros.cantidad} }, {new : true},
        (err, stockModificado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!stockModificado) return res.status(500).send({mensaje: 'Error incrementar la cantidad del producto'});

            return res.status(200).send({ producto: stockModificado })
        });
}

function obtenerAgotados(req, res) {

    Productos.find({ cantidad: 0 }).exec(
        (err, productosEncontrados) => {
            if (err) {
                res.status(500).send("Error en la peticion");
            } else {
                if (!productosEncontrados) return res.status(500).send({ mensaje: "No tiene productos con ese nombre" })
                return res.status(200).send({ producto: productosEncontrados });
            }
        })
}

module.exports = {
    AgregarProductos,
    editarProductos,
    stockProducto,
    obtenerProductos,
    obtenerProductoPorNombre,
    obtenerProductosPorCategoria,
    obtenerAgotados
}