const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { requireAuth } = require("../middlewares/auth");


router.get('/', branchController.index);
router.post('/', requireAuth, branchController.store);
router.get('/:ID', branchController.show);
router.put('/:ID', requireAuth, branchController.update);

module.exports = router;


