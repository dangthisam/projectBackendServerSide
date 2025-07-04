const express = require('express');

const router = express.Router();
const {userRegister  , userRegisterPost  , userLogin  , userLoginPost  , logoutUser  }=require("../../controllers/clients/user.controller");
const userValidation=require("../../validate/client/register");



router.get("/register" , userRegister);
router.post("/register" , userValidation.userValidation , userRegisterPost);

router.get("/login", userLogin);

router.post("/login",  userValidation.loginValidation , userLoginPost)

router.get("/logout", logoutUser);

module.exports = router;