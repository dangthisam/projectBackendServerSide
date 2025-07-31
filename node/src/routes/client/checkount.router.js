const express = require("express");

const router = express.Router();

const {
  checkoutProducts,
  checkProductDetail,
  successOrder,
  paymentOrder,
  paymentSuccess,
} = require("../../controllers/clients/checkout.controller");

router.get("/", checkoutProducts);

router.post("/order", checkProductDetail);

router.get("/success/:id", successOrder);

router.get("/payment/vnpay/create", paymentOrder);
router.get("/payment/vnpay/success", paymentSuccess);
module.exports = router;
