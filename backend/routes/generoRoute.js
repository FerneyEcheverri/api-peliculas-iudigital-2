const { Router } = require('express');
const { 
  createGenero, 
  getGenero, 
  updateGenero, 
  deleteGenero 
} = require('../controllers/generoController');

const router = Router();

// Endpoint base: /api/genero
router.post('/', createGenero);     // Crear género
router.get('/', getGenero);       // Listar todos los géneros
router.put('/:id', updateGenero);   // Actualizar género por ID
router.delete('/:id', deleteGenero); // Eliminar género por ID

module.exports = router;