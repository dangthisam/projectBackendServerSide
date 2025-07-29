const express = require('express');
const router = express.Router();

const {index  , filterProducts}=require("../../controllers/clients/homeController");


router.get("/home"  , index);
router.get("/home/filter"  , filterProducts);




module.exports=router;