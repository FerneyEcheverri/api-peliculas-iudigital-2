const { Router } = require('express');
const { createTipo, getTipos, updateTipo, deleteTipo } = require('../controllers/tipoController');

const router = Router();

// Endpoints
router.post('/', createTipo);
router.get('/', getTipos);
router.put('/:id', updateTipo);
router.delete('/:id', deleteTipo);

// IMPORTANTE: Exportar el enrutador al final
module.exports = router;