const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/:productId',controller.getProductId);

router.post('/', controller.Products);
router.get('/', controller.GetProducts);

module.exports = router;