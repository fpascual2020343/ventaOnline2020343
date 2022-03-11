const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
    producto: String,
    proveedor: String,
    cantidad: Number,
    precio: Number,
    idCategoria: { type: Schema.Types.ObjectId, ref: "Categorias"}
})

module.exports = mongoose.model('Productos', ProductosSchema)