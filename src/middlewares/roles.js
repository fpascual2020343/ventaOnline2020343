exports.ADMIN = function(req, res, next) {
    if(req.user.rol !== "Admin") return res.status(403).send({mensaje: "Solo puede acceder el admin"})
    
    next();
}