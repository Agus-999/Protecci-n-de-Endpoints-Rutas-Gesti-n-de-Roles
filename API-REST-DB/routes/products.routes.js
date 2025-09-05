const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller')
const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

// Obtener todos los productos → requiere estar logueado
router.get('/', verifyToken, getProducts)

// Obtener un producto por ID → requiere estar logueado
router.get('/:id', verifyToken, getProductById)

// Crear producto → solo admins
router.post('/', verifyToken, isAdmin, createProduct)

// Editar producto → solo admins
router.put('/:id', verifyToken, isAdmin, updateProduct)

// Eliminar producto → solo admins
router.delete('/:id', verifyToken, isAdmin, deleteProduct)

module.exports = router
