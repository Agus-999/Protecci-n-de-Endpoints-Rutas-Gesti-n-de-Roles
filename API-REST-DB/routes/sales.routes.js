const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, createSale, updateSale, deleteSale } = require('../controllers/ventas.controller');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Obtener todas las ventas → solo admin
router.get('/', verifyToken, isAdmin, getAllSales);

// Obtener venta por ID → solo admin
router.get('/:id', verifyToken, isAdmin, getSaleById);

// Crear nueva venta → cualquier usuario logueado
router.post('/', verifyToken, createSale);

// Actualizar venta → solo admin
router.put('/:id', verifyToken, isAdmin, updateSale);

// Eliminar venta → solo admin
router.delete('/:id', verifyToken, isAdmin, deleteSale);

module.exports = router;
