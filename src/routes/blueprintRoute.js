const express = require('express');
const router = express.Router();
const blueprintController = require('../controllers/blueprintController');

router.get('/', blueprintController.index);
router.post('/', blueprintController.store);
router.get('/:ID', blueprintController.show);
router.put('/:ID', blueprintController.update);
router.delete('/:ID', blueprintController.delete);
router.get('/blueprints/:ID', blueprintController.verPlanos);
router.get('/photos/:ID', blueprintController.verFotosPlano);



module.exports = router;


