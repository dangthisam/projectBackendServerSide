const express = require('express');

const router = express.Router();

const {checkoutProducts, checkProductDetail , successOrder , paymentOrder}=require("../../controllers/clients/checkout.controller");


router.get("/", checkoutProducts);

router.post("/order", checkProductDetail);

router.get("/success/:id",successOrder);

router.get("/payment/vnpay/create" , paymentOrder);
module.exports = router;