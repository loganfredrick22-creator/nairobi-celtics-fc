const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, updateStock } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.patch('/:id/stock', protect, admin, updateStock);

module.exports = router;
