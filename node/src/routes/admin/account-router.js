const express = require('express');
const uploadClould=require("../../middleware/admin/uploadCloud.middleware");
const { indexRouter  , createAccount , createAccountPost  , editAccount , editAccountPath , detailAccount , deleteAccount  , changestatusAccount} = require('../../controllers/admin/account.controller');
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
router.get('/accounts/edit/:id', editAccount);

router.patch('/accounts/edit/:id',
     upload.single("avatar"),
     uploadClould.upload,
     validateCreateProduct.createPassword,
     editAccountPath)


router.patch("/accounts/change-status/:status/:id", changestatusAccount);

router.get("/accounts/detail/:id", detailAccount);

router.delete("/accounts/delete/:id", deleteAccount);

module.exports = router;