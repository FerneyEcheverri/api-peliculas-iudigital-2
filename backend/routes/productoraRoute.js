const { Router } = require('express');
const { 
    getProductoras, 
    createProductora, 
    updateProductora,
    deleteProductora
} = require('../controllers/productoraController');

const router = Router();

// Endpoints para /api/productora
router.get('/', getProductoras);
router.post('/', createProductora);
router.put('/:id', updateProductora);
router.delete('/:id', deleteProductora);

module.exports = router;