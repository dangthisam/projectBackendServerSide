const express = require('express');

const router = express.Router();
const {cardProducts}=require("../../controllers/clients/cart.controller");


router.post("/add/:idProducts", cardProducts);

module .exports=router