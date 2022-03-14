const Facturas = require('../models/factura.models');
const Usuario = require('../models/usuarios.models');
const Productos = require('../models/productos.model');

function carritoAFactura(req, res) {

    var modeloFactura = new Facturas();

    Usuario.find({ cliente: req.user.sub }, (err, carritoEncontrado) => {

        if (err) return res.status(500).send({ error: "error en la petición" });
        if (!carritoEncontrado) return res.status(500).send({ error: "Carrito no encontrado" });

        if (carritoEncontrado.carrito.length != 0) {

            modeloFactura.cliente = carritoEncontrado.cliente;
            modeloFactura.total = carritoEncontrado.total;

            modeloFactura.save((err, facturaGuardada) => {

                if (err) return res.status(500).send({ error: "error en la peticion" });

                for (let i; i < carritoEncontrado.carrito.length; i++) {

                    var idProducto = carritoEncontrado.carrito[i].idProducto;
                    var cantidad = carritoEncontrado.carrito[i].cantidad;
                    var subTotal = carritoEncontrado.carrito[i].subTotal;
                    var idFacturaAgregada = facturaGuardada._id

                    Facturas.findByIdAndUpdate(idFacturaAgregada,
                        {
                            $push:
                            {
                                Productos:
                                    { idProducto: idProducto, cantidad: cantidad, subTotal: subTotal }
                            }
                        },
                        { new: true }, (err, facturaSave) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
                            if (!facturaSave) return res.status(500).send({ mensaje: 'Error al guarfdar la factura' });
                        })

                        var stockM = cantidad*-1;

                        console.log({stockM: stockM})

                        Productos.findByIdAndUpdate(idProducto,{ $inc : {cantidad : stockM} },{new: true},(err,stockEdit) => {

                            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
                            if(!stockEdit) return res.status(500).send({ mensaje: 'Error al editar la cantidad del producto' });
                            
                        })

                }


            })

        }


    })

    let tabla = []
    let precio1 = 0; 
    let precio2 = 0; 
    let precio3 = 0; 
    tabla.push(`Nombre del Cliente: ${carritoEncontrado.cliente.nombre}` )
        for (let i = 0; i < carritoEncontrado.carrito.length; i++) {
            precio1 = Number(carritoEncontrado.carrito[i].cantidad)
            precio2 = Number(carritoEncontrado.carrito[i].subTotal)
            precio3 = precio2/precio1
            tabla.push(`\n\nProducto #${i+1}: ${carritoEncontrado.carrito[i].idProducto.nombre}, 
                        \nCantidad: ${carritoEncontrado.carrito[i].cantidad}, 
                        \nPrecio unitario: Q.${precio3}, 
                        \nSubTotal: ${carritoEncontrado.carrito[i].subTotal}`)
        }

}

module.exports = {
    carritoAFactura
}