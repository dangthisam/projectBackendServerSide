const express = require('express');

const router = express.Router();
const {userRegister  , userRegisterPost  , userLogin  , userLoginPost  , logoutUser, userProfile  , userForgotPassword , userForgotPasswordPost , userPasswordOtp , userPasswordPost , userResetPassword,
    userResetPasswordPost
}=require("../../controllers/clients/user.controller");
const userValidation=require("../../validate/client/register");

const validateResetPassword=require("../../validate/client/resetPassword");

const userMiddleware=require("../../middleware/client/auth.middleware");



router.get("/register" , userRegister);
router.post("/register" , userValidation.userValidation , userRegisterPost);

router.get("/login", userLogin);

router.post("/login",  userValidation.loginValidation , userLoginPost)

router.get("/logout", logoutUser);

router.get("/profile" ,userMiddleware.authMiddleware, userProfile);

router.get("/password/forgot", userForgotPassword);

 router.post("/password/forgot", userForgotPasswordPost)
 router.get("/password/otp",userPasswordOtp);

 router.post("/password/otp",userPasswordPost)

 router.get("/password/reset" , userResetPassword);
 
 router.post("/password/reset", validateResetPassword.resetPassword,userResetPasswordPost)

module.exports = router;