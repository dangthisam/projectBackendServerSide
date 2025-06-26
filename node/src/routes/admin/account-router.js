const express = require('express');
const uploadClould=require("../../middleware/admin/uploadCloud.middleware");
const { indexRouter  , createAccount , createAccountPost } = require('../../controllers/admin/account.controller');
const validateCreateProduct = require("../../validate/admin/create.validate");
const router = express.Router();
const cloudinary = require('cloudinary').v2
const multer  = require('multer')
cloudinary.config({
    cloud_name:"domztsqxo",
    api_key :"698989336354439",
    api_secret:"uF-fEN7ADPBH45EZOyxb7i3UtEc"
})
const upload = multer()


router.get('/accounts', indexRouter);

router.get('/accounts/create', createAccount);

router.post('/accounts/create',
    upload.single("avatar"),
     uploadClould.upload,
//tao ra 1 middleware de kiem tra du lieu trc khi insert vao csdl
    // validateCreateProduct.createProducts,
     validateCreateProduct.createProducts,
     createAccountPost,
    
    )

module.exports = router;