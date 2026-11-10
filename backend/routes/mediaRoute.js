const { Router } = require('express');
const { createMedia, getMedias, getMediaById, updateMedia, deleteMedia } = require('../controllers/mediaController');
const router = Router();
router.post('/', createMedia);
router.get('/', getMedias);
router.get('/:id', getMediaById);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
module.exports = router;
