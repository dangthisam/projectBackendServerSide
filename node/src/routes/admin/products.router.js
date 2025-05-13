const { productAdmin , changestatus , changestatusMulti ,deleteProduct , createProduct , createPost , editProduct, editPathProducts , detailProduct} =require("../../controllers/admin/product.controller");
const express = require('express');
const { create } = require("../../models/products");
const  validateCreateProduct  = require("../../validate/admin/products.validate");
const uploadClould=require("../../middleware/admin/uploadCloud.middleware");
const path = require("path");
const app =express();
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

require("dotenv").config();
const multer  = require('multer')
cloudinary.config({
    cloud_name:"domztsqxo",
    api_key :"698989336354439",
    api_secret:"uF-fEN7ADPBH45EZOyxb7i3UtEc"
})



//const fileUpload = require("express-fileupload");

const router = express.Router();

const upload = multer()


router.get("/products" , productAdmin);
// khi có dấu hai chấm có ngĩa là dữ liệu sẽ láy động trên url hay là client chuyền đến
router.patch("/products/change-status/:status/:id" , changestatus);
router.patch("/products/change-multi", changestatusMulti);
router.delete("/products/delete/:id", deleteProduct);
router.get("/products/create",createProduct)
router.post(
    "/products/create",
    
     upload.single("thumbnail"),
     uploadClould.upload,
//tao ra 1 middleware de kiem tra du lieu trc khi insert vao csdl
    // validateCreateProduct.createProducts,
     validateCreateProduct.createProducts,
     createPost,
    
    );

    // edit product
router.get("/products/edit/:id", editProduct);
router.patch("/products/edit/:id",editPathProducts)
router.get("/products/detail/:id", detailProduct);
module.exports = router;

