const express = require('express');
const router = express.Router();
const blueprintPhotosController = require('../controllers/blueprintPhotosController');
const { requireAuth } = require("../middlewares/auth");

router.get('/', requireAuth, blueprintPhotosController.index);
router.post('/', requireAuth, blueprintPhotosController.store);
router.get('/:ID', requireAuth, blueprintPhotosController.show);
router.put('/:ID', requireAuth, blueprintPhotosController.update);
router.delete('/:ID', requireAuth, blueprintPhotosController.delete);




module.exports = router;


