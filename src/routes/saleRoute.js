const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { requireAuth } = require("../middlewares/auth");

router.get('/', requireAuth, saleController.index);
router.post('/', requireAuth, saleController.store);
router.get('/:ID', requireAuth, saleController.show);
router.put('/:ID', requireAuth, saleController.update);
router.get('/search/:customer_name', requireAuth, saleController.findByName);
router.get('/filter/:status?/:branch_id?/:complete_payment?/:created_at?', requireAuth, saleController.filterSales);
router.delete('/:ID', requireAuth, saleController.delete);


module.exports = router;
