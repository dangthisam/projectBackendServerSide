
const express = require('express');
const {productCategoryAdmin , createCategoryAdmin , postcreateCategoryAdmin , changeStatusCategory , changeManyStatusCategory ,detailProductCategory , deleteCategory}=require("../../controllers/admin/product-category.controller")
require("dotenv").config();
const router = express.Router();
const  validateCreateProduct  = require("../../validate/admin/products-validate");
const uploadClould=require("../../middleware/admin/uploadCloud.middleware");
const multer  = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer()
cloudinary.config({
    cloud_name:"domztsqxo",
    api_key :"698989336354439",
    api_secret:"uF-fEN7ADPBH45EZOyxb7i3UtEc"
})

router.get("/products-category" , productCategoryAdmin)
router.get("/products-category/create",createCategoryAdmin )
router.patch("/products-category/change-status/:status/:id" , changeStatusCategory);
router.patch("/products-category/change-multi", changeManyStatusCategory);
router.post(
    "/products-category/create",
    
     upload.single("thumbnail"),
     uploadClould.upload,
//tao ra 1 middleware de kiem tra du lieu trc khi insert vao csdl
    // validateCreateProduct.createProducts,
     validateCreateProduct.createProducts,
     postcreateCategoryAdmin,
    
    );

//router detail category

router.get("/products-category/detail/:id" , detailProductCategory);

router.delete("/productS-category/delete/:id" , deleteCategory);

module.exports = router;

