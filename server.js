require("dotenv").config();
const path = require("path");
const express = require("express");
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express();
const methodOverride = require('method-override')
const port = process.env.PORT || 4000;
//file dot nay có nhiệm vụ lưu các biến dùng nhiều để fix cho dễ
const {configViewEngine , configPug }= require(path.join(__dirname, "node/src/config/viewEngine"));
const clienRouter = require(path.join(__dirname, "node/src/routes/client/routerCliten"));
//const productsRouter = require(path.join(__dirname, "node/src/routes/client/routerProducts"));
const webRouter = require(path.join(__dirname, "node/src/routes/web"));
const connection = require(path.join(__dirname, "node/src/config/db"));
//const fileUpload = require("express-fileupload");
const Kitten = require(path.join(__dirname, "node/src/models/user"));
const prefixAdmin = require(path.join(__dirname, "node/src/config/system"));
const routeradmin = require(path.join(__dirname, "node/src/routes/admin/index.router"));
const productAdmin = require(path.join(__dirname, "node/src/routes/admin/products.router"));
const productCateroryAdmin=require(path.join(__dirname,"node/src/routes/admin/product-category"))
const { MongoClient } = require("mongodb");
const { mongo, default: mongoose } = require("mongoose");
//hien thi thong bao khi thay doi tang trang thai app.use(express.cookieParser('keyboard cat'));

app.use(cookieParser('nguyenvansamthichdangthithuy'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

  //
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true }));
const systemAdmin  =require("./node/src/config/system");
// override method post, put, delete
app.use(methodOverride('_method'))
//config uploadFile
//app.use(fileUpload());
//configViewEngine(app);
configPug(app); 
app.use("", webRouter);
app.use(prefixAdmin.prefixAdmin, productAdmin);
app.use(prefixAdmin.prefixAdmin, productCateroryAdmin);
app.use("", clienRouter);
// tao mot bien toan cuj de su dung trong cac file pug 
app.use(prefixAdmin.prefixAdmin, routeradmin);
//tinyEcm
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//end tinyEcm
app.locals.prefixAdmin=systemAdmin.prefixAdmin;

// Thêm vào trước các app.use cho router

connection();


  app.listen(port, () => {
    console.log(` app listening on port ${port}`);
  });
  // Thêm vào cuối file

//})();
