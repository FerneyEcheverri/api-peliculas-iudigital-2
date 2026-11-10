const { Router } = require('express');
const { createTipo, getTipos, updateTipo } = require('../controllers/tipoController');

const router = Router();

// Endpoints
router.post('/', createTipo);
router.get('/', getTipos);
router.put('/:id', updateTipo);

// IMPORTANTE: Exportar el enrutador al final
module.exports = router;