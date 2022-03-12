exports.ADMIN = function(req, res, next) {
    if(req.user.rol !== "Admin") return res.status(403).send({mensaje: "Solo puede acceder el Admin Master"})
    
    next();
}

exports.verAdministrador = function(req, res, next) {
    if(req.user.rol !== "Administrador") return res.status(403).send({mensaje: "Solo puede acceder el Administrador"})
    
    next();
}

exports.verCliente = function(req, res, next) {
    if(req.user.rol !== "Cliente") return res.status(403).send({mensaje: "Solo puede acceder el Cliente"})
    
    next();
}