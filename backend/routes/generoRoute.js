const { Router } = require('express');
const { createGenero, getGeneros, updateGenero } = require('../controllers/generoController');

const router = Router();

// Endpoint base: /api/genero
router.post('/', createGenero);     // Crear género
router.get('/', getGeneros);       // Listar todos los géneros
router.put('/:id', updateGenero);   // Actualizar género por ID

module.exports = router;