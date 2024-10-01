const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.index);
router.post('/', saleController.store);
router.get('/:ID', saleController.show);
router.put('/:ID', saleController.update);
router.get('/search/:customer_name', saleController.findByName);
router.get('/filter/:status?/:branch_id?/:complete_payment?/:created_at?', saleController.filterSales);
router.delete('/:ID', saleController.delete);


module.exports = router;
