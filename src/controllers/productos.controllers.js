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
        if(err) return res.status(400).send({ mensaje: "Error en la peticion"});
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error al encontrar los productos"});

        return res.status(200).send({productos: productoEncontrado});
    }).populate("idCategoria", "nombre");

}

function obtenerProductoPorNombre (req, res) {

    var parametros = req.body;
    
    Productos.find({producto: { $regex: parametros.producto, $options: "i" }}, (err, productoEncontrado)=>{

        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        
        if(!productoEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el producto'})

        return res.status(200).send({ producto: productoEncontrado })

    }).populate('idCategoria', 'nombre');


}


module.exports = {
    AgregarProductos,
    editarProductos,
    obtenerProductos,
    obtenerProductoPorNombre
}