const express = require('express');

const router = express.Router();
const {chat}=require("../../controllers/clients/chat.controller")

router.get("/", chat);

module.exports = router;