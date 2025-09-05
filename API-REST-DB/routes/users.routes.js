const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    updateUserRole
} = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Obtener todos los usuarios → solo admin
router.get('/', verifyToken, isAdmin, getUsuarios);

// Obtener un usuario por ID → cualquier logueado (o admin si se quisiera ampliar)
router.get('/:id', verifyToken, getUsuarioById);

// Editar usuario → el propio usuario o admin
router.put('/:id', verifyToken, updateUsuario);

// Eliminar usuario → solo admin
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);

// Actualizar rol de usuario → solo admin
router.put('/:id/rol', verifyToken, isAdmin, updateUserRole);

module.exports = router;
