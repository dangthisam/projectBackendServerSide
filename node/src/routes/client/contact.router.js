
const express = require("express");
const router=express.Router();
const {indexContact} =require("../../controllers/clients/contact.controller");
router.get("/", indexContact)

module.exports = router;