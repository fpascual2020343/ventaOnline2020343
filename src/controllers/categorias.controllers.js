var Categoria = require("../models/categorias.model");
var Producto = require("../models/productos.model");


function agregarCategoria(req, res) {
    var parametros = req.body;
    var modeloCategoria = new Categoria();

    if (parametros.nombre) {

        modeloCategoria.nombre = parametros.nombre;
        modeloCategoria.idUsuario = req.user.sub;

        modeloCategoria.save((err, categoriaGuardada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaGuardada) return res.status(500).send({ mensaje: 'Error al guardar el proveedor' });

            return res.status(200).send({ categoria: categoriaGuardada })
        })

    } else {
        return res.status(404).send({ mensaje: 'Debe enviar los parametros Obligatorios' });
    }
}

function editarCategoria(req, res) {

    var CategoriaId = req.params.idCategoria;
    var parametros = req.body;

    Categoria.findByIdAndUpdate(CategoriaId, parametros, { new: true }, (err, categoriaProducto) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoriaProducto) return res.status(404).send({ mensaje: 'Error al Editar la categoria' });

        return res.status(200).send({ categoria: categoriaProducto });
    })
}

function eliminarCategoriaDefaut(req, res) {

    var categoriaId = req.params.idCategoria;

    Categoria.findOne({ nombre: "Por Defecto" }, (err, categoriaEncontrada) => {

        if (!categoriaEncontrada) {

            var modeloCategoria = new Categoria();
            modeloCategoria.nombre = "Por Defecto";
            modeloCategoria.idUsuario = null;

            modeloCategoria.save((err, categoriaGuardada) => {
                if (err) return res.status(400).send({ mensaje: 'Error en la peticion de Guardar la categoria' });
                if (!categoriaGuardada) return res.status(400).send({ mensaje: 'Error al guardar la categoria' });

                Producto.updateMany({ idCategoria: categoriaId }, { idCategoria: categoriaGuardada._id }, (productosEditados) => {

                    if (err) return res.status(400).send({ mensaje: 'Error en la peticion de actualizar productis' });

                    Categoria.findByIdAndDelete(categoriaId, (err, categoriaEliminada) => {
                        if (err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar categoria" });
                        if (!categoriaEliminada) return res.status(400).send({ mensaje: 'Error al eliminar la categoria' });

                        return res.status(200).send({ 
                            editado: productosEditados,
                            eliminado: categoriaEliminada
                        })
                    })
                })
            })

        } else {

            Producto.updateMany({ idCategoria: categoriaId }, { idCategoria: categoriaEncontrada._id }, (productosEditados) => {

                if (err) return res.status(400).send({ mensaje: 'Error en la peticion de actualizar productis' });

                Categoria.findByIdAndDelete(categoriaId, (err, categoriaEliminada) => {
                    if (err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar categoria" });
                    if (!categoriaEliminada) return res.status(400).send({ mensaje: 'Error al eliminar la categoria' });

                    return res.status(200).send({ 
                        editado: productosEditados,
                        eliminado: categoriaEliminada
                    })
                })
            })

        }
    })

}

function obtenerCategorias (req, res) {

    Categoria.find({}, (err, categoriaEncontradas) => {
        if(err) return res.status(400).send({ mensaje: "Error en la peticion"});
        if(!categoriaEncontradas) return res.status(404).send({ mensaje: "Error al encontrar las categorias"});

        return res.status(200).send({categoria: categoriaEncontradas});
    })
}

module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoriaDefaut,
    obtenerCategorias
}