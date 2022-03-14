const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facturaSchema = new Schema({
    
    cliente:{ type: Schema.Types.ObjectId, ref: 'Usuarios'},
    productos:[
        {idProducto:{ type: Schema.Types.ObjectId, ref: 'Productos'},
        cantidad: Number,
        subTotal:Number}
    ],
    total:Number 

})

module.exports = mongoose.model('Facturas', facturaSchema);