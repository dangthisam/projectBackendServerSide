const express = require('express');

const router = express.Router();
const {cardProducts , cartProducts}=require("../../controllers/clients/cart.controller");


router.post("/add/:idProducts", cardProducts);
router.get("/", cartProducts);

module .exports=router