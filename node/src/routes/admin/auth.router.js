const express = require('express');
const router = express.Router();

const { authLogin  , loginPost  , logoutAdmin  ,detailAccount} = require('../../controllers/admin/auth.controller');
const { authLogin: validateAuthLogin } = require('../../validate/admin/auth.validate');
router.get("/auth/login", authLogin);

router.post("/auth/login" , validateAuthLogin , loginPost)

router.get("/auth/logout", logoutAdmin);






module.exports = router;