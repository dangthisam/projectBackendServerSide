const admin =require("../../controllers/admin/dashboard.controller");
const express = require('express');
const router = express.Router();


router.get("/dashboard" , admin);
module.exports =router;

