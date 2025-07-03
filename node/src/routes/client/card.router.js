const express = require('express');

const router = express.Router();
const {cardProducts , cartProducts  , deleteProductInCart , updateQuantityProduct}=require("../../controllers/clients/cart.controller");


router.post("/add/:idProducts", cardProducts);
router.get("/", cartProducts);
router.get("/delete/:id", deleteProductInCart);

router.get("/update/:id/:quantity", updateQuantityProduct)

module .exports=router