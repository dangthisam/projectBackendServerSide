const express = require('express');

const router = express.Router();

const {checkoutProducts, checkProductDetail , successOrder}=require("../../controllers/clients/checkout.controller");


router.get("/", checkoutProducts);

router.post("/order", checkProductDetail);

router.get("/success/:id",successOrder);
module.exports = router;