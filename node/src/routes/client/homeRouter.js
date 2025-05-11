const express = require('express');
const router = express.Router();

const ClientsController=require("../../controllers/clients/homeController");
router.get("/home"  , ClientsController);


module.exports=router;