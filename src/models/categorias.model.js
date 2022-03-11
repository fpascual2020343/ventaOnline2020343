const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    nombre: String,
    idUsuario: {type: Schema.Types.ObjectId, ref: "Usuarios"}
})

module.exports = mongoose.model('Categorias', categoriaSchema);