const express = require('express');
const { searchProducts } = require('../../controllers/clients/searchProducts.Controller');
const router = express.Router();

router.get("/", searchProducts);

module.exports = router;