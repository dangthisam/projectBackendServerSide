const express = require('express');
const router = express.Router();

const { authLogin  , loginPost } = require('../../controllers/admin/auth.controller');
const { authLogin: validateAuthLogin } = require('../../validate/admin/auth.validate');
router.get("/auth/login", authLogin);

router.post("/auth/login" , validateAuthLogin , loginPost)

module.exports = router;