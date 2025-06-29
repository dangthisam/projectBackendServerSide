const express = require('express');
const router = express.Router();
const productsRouter = require('./routerProducts');
//const productsRouter =require("./router") // Import router con
const middlewareCaterory = require("../../middleware/client/category.middleware");
const homeRouter=require("./homeRouter");
// Route chính

router.use('/', homeRouter);





// Gắn router con cho /products
router.use('/products',productsRouter);

module.exports = router;