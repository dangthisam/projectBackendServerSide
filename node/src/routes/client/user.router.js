const express = require('express');

const router = express.Router();
const {userRegister  , userRegisterPost}=require("../../controllers/clients/user.controller");
const userValidation=require("../../validate/client/register");



router.get("/register" , userRegister);
router.post("/register" , userValidation.userValidation , userRegisterPost);

module.exports = router;