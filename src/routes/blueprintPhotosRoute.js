const express = require('express');
const router = express.Router();
const blueprintPhotosController = require('../controllers/blueprintPhotosController');

router.get('/', blueprintPhotosController.index);
router.post('/', blueprintPhotosController.store);
router.get('/:ID', blueprintPhotosController.show);
router.put('/:ID', blueprintPhotosController.update);
router.delete('/:ID', blueprintPhotosController.delete);




module.exports = router;


