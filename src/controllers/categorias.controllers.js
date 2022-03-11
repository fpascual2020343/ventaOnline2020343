var Categoria = require("../models/categorias.model");


function agregarCategoria(req, res) {
    var parametros = req.body;
    var modeloCategoria = new Categoria();

    if(parametros.nombre){

        modeloCategoria.nombre = parametros.nombre;
        modeloCategoria.idUsuario = req.user.sub;

        modeloCategoria.save((err, categoriaGuardada) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!categoriaGuardada) return res.status(500).send({ mensaje: 'Error al guardar el proveedor'});

            return res.status(200).send({ categoria: categoriaGuardada})
        })

    } else {
        return res.status(404).send({ mensaje: 'Debe enviar los parametros Obligatorios'});
    }
}

function editarCategoria(req, res){

    var CategoriaId = req.params.idCategoria;
    var parametros = req.body;
    
    Categoria.findByIdAndUpdate(CategoriaId, parametros, { new: true}, (err, categoriaProducto) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoriaProducto) return res.status(404).send({ mensaje: 'Error al Editar la categoria'});

        return res.status(200).send({ categoria: categoriaProducto});
    })
}

function eliminarCategoria (req, res) {

    var categoriaId = req.params.idCategoria;

    Categoria.findByIdAndDelete(categoriaId, (err, categoriaEliminado)=>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoriaEliminado) return res.status(500).send({ mensaje: 'Error al eliminar la categoria'})

        return res.status(200).send({ categoria: categoriaEliminado });
    })
}



module.exports = {
    agregarCategoria,
    editarCategoria,
    
}