const mongoose = require('mongoose');
const app = require('./app');
const crearAdmin = require('./src/controllers/usuarios.controllers');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ventaOline2020343', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    app.listen(3000, function (){
        console.log("Servidor de Express corriendo correctamente en el puerto 3000");
    });

    crearAdmin.registrarAdminDefault();

}).catch(error => console.log(error));