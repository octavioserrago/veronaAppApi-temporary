const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');


router.get('/', branchController.index);
router.post('/', branchController.store);
router.get('/:ID', branchController.show);
router.put('/:ID', branchController.update);

module.exports = router;


