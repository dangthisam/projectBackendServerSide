const express = require("express");
const router = express.Router();
const OtpAuthController = require("../../controllers/client/otpAuthController");

// Đăng ký
router.get("/register", OtpAuthController.registerPage);
router.post("/register", OtpAuthController.register);

// Đăng nhập
router.get("/login", OtpAuthController.loginPage);
router.post("/login", OtpAuthController.login);

// Profile và logout
router.get("/profile", OtpAuthController.profile);
router.post("/logout", OtpAuthController.logout);

// Demo OTP generation
router.get("/demo/:username", OtpAuthController.generateDemoOTP);

module.exports = router;