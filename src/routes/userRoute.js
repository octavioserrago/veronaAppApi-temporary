const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require("../middlewares/auth");


router.get('/', requireAuth, userController.index);
router.post('/', requireAuth, userController.store);
router.get('/:ID', requireAuth, userController.show);
router.put('/:ID', requireAuth, userController.update);
router.post('/login', userController.auth);
router.delete('/:ID', requireAuth, userController.delete);



module.exports = router;