const express = require('express');
const router = express.Router();
const blueprintController = require('../controllers/blueprintController');
const { requireAuth } = require("../middlewares/auth");

router.get('/', requireAuth, blueprintController.index);
router.post('/', requireAuth, blueprintController.store);
router.get('/:ID', requireAuth, blueprintController.show);
router.put('/:ID', requireAuth, blueprintController.update);
router.delete('/:ID', requireAuth, blueprintController.delete);
router.put('/:ID', requireAuth, blueprintController.updateBlueprintStatus);
router.get('/sales/:ID', requireAuth, blueprintController.getPlanosPorVenta);
router.get('/sales/photos/:ID', requireAuth, blueprintController.verFotosPorVenta);



module.exports = router;


