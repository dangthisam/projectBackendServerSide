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
const userRegister=require("./user.router");


// Route chính


router.use('/', homeRouter);

// Gắn router con cho /products
router.use('/products',productsRouter);
router.use("/search" , searchProductsRouter)

router.use("/cart", cardProductsRouter)

router.use("/checkout", checkoutProductsRouter)

router.use("/user" , userRegister);

router.get("*" , (req, res) =>{
    res.render("clients/pages/error/404",{
        title:"404 Error"
    })

  
})
module.exports = router;