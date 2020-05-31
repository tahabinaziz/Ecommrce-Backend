const express = require('express');
const router = express.Router();
const controller = require('./Controller');



router.post('/', controller.Purchase);
router.get('/', controller.GetPurchase);

module.exports = router;