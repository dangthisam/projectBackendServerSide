const { productAdmin , changestatus , changestatusMulti ,deleteProduct , createProduct , createPost , editProduct, editPathProducts , detailProduct} =require("../../controllers/admin/product.controller");
const express = require('express');
const { create } = require("../../models/products");
const  validateCreateProduct  = require("../../validate/admin/products.validate");
const path = require("path");
const app =express();

const fileUpload = require("express-fileupload");

const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })


router.get("/products" , productAdmin);
// khi có dấu hai chấm có ngĩa là dữ liệu sẽ láy động trên url hay là client chuyền đến
router.patch("/products/change-status/:status/:id" , changestatus);
router.patch("/products/change-multi", changestatusMulti);
router.delete("/products/delete/:id", deleteProduct);
router.get("/products/create",createProduct)
router.post(
    "/products/create",
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

