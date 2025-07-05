const express = require('express');

const router = express.Router();
const {userRegister  , userRegisterPost  , userLogin  , userLoginPost  , logoutUser, userProfile  , userForgotPassword , userForgotPasswordPost , userPasswordOtp , userPasswordPost , userResetPassword,
    userResetPasswordPost
}=require("../../controllers/clients/user.controller");
const userValidation=require("../../validate/client/register");

const validateResetPassword=require("../../validate/client/resetPassword");



router.get("/register" , userRegister);
router.post("/register" , userValidation.userValidation , userRegisterPost);

router.get("/login", userLogin);

router.post("/login",  userValidation.loginValidation , userLoginPost)

router.get("/logout", logoutUser);

router.get("/profile" , userProfile);

router.get("/password/forgot", userForgotPassword);

 router.post("/password/forgot", userForgotPasswordPost)
 router.get("/password/otp",userPasswordOtp);

 router.post("/password/otp",userPasswordPost)

 router.get("/password/reset" , userResetPassword);
 
 router.post("/password/reset", validateResetPassword.resetPassword,userResetPasswordPost)

module.exports = router;