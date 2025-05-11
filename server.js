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
const {configViewEngine , configPug }= require("./node/src/config/viewEngine");
const clienRouter=require("./node/src/routes/client/routerCliten");
//const productsRouter=require("./node/src/routes/client/routerProducts");
const webRouter = require("./node/src/routes/web");
const connection = require("./node/src/config/db");
const fileUpload = require("express-fileupload");
const Kitten = require("./node/src/models/user");
const prefixAdmin =require("./node/src/config/system");
const routeradmin =require("./node/src/routes/admin/index.router");
const productAdmin =require("./node/src/routes/admin/products.router");
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
app.use(fileUpload());
//configViewEngine(app);
configPug(app); 
app.use("", webRouter);
app.use(prefixAdmin.prefixAdmin, productAdmin);
app.use("", clienRouter);
// tao mot bien toan cuj de su dung trong cac file pug 
app.use(prefixAdmin.prefixAdmin, routeradmin);

app.locals.prefixAdmin=systemAdmin.prefixAdmin;
  


connection();


  app.listen(port, () => {
    console.log(` app listening on port ${port}`);
  });
//})();
