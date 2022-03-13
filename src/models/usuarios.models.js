const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    usuario: String,
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    rol: String,
    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number,
        subTotal: Number
    }],
    totalCarrito: Number
})

module.exports = mongoose.model('Usuarios', usuarioSchema);