const { Router } = require('express');
const { getDirectores, createDirector, updateDirector } = require('../controllers/directorController');

const router = Router();

// Obtener todos los directores (GET)
router.get('/', getDirectores);

// Crear un nuevo director (POST)
router.post('/', createDirector);

// Actualizar un director por ID (PUT)
router.put('/:id', updateDirector);

module.exports = router;