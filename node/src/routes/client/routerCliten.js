const express = require('express');
const router = express.Router();
const productsRouter = require('./routerProducts');
//const productsRouter =require("./router") // Import router con
const middlewareCaterory = require("../../middleware/client/category.middleware");
const middlewareProduct = require("../../middleware/client/card.middleware");

const homeRouter=require("./homeRouter");
const searchProductsRouter=require("./searchRouter");
const cardProductsRouter=require("./card.router");
const checkoutProductsRouter=require("./checkount.router");

// Route chính


router.use('/', homeRouter);

// Gắn router con cho /products
router.use('/products',productsRouter);
router.use("/search" , searchProductsRouter)

router.use("/cart", cardProductsRouter)

router.use("/checkout", checkoutProductsRouter)
module.exports = router;