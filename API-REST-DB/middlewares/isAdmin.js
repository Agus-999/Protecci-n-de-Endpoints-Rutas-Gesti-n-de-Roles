const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') { // <-- corregido
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
    }
    next();
};

module.exports = isAdmin;
