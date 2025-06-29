const express = require('express');
const router = express.Router();

const {index}=require("../../controllers/clients/homeController");


router.get("/home"  , index);


module.exports=router;