require("dotenv").config();
const path = require("path");
const express = require("express");
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express();
const methodOverride = require('method-override')
const moment = require("moment");


//limit req to IP to server 
// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window`
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });


//get IP user

const port = process.env.PORT || 4000;
//file dot nay có nhiệm vụ lưu các biến dùng nhiều để fix cho dễ
const {configViewEngine , configPug }= require(path.join(__dirname, "node/src/config/viewEngine"));

// Fix the incomplete require statement - complete the path properly
const clienRouter = require(path.join(__dirname, "node/src/routes/client/routerCliten"));
const http = require('http');
const { Server } = require('socket.io');
//const productsRouter = require(path.join(__dirname, "node/src/routes/client/routerProducts"));
const webRouter = require(path.join(__dirname, "node/src/routes/web"));
const connection = require(path.join(__dirname, "node/src/config/db"));

//const fileUpload = require("express-fileupload");
const Kitten = require(path.join(__dirname, "node/src/models/user"));
const middlewareCaterory = require(path.join(__dirname, "node/src/middleware/client/category.middleware"));
const prefixAdmin = require(path.join(__dirname, "node/src/config/system"));
const routeradmin = require(path.join(__dirname, "node/src/routes/admin/index.router"));
const settingGeneral = require(path.join(__dirname, "node/src/routes/admin/setting-general.router"));
const productAdmin = require(path.join(__dirname, "node/src/routes/admin/products.router"));
const detailProfile = require(path.join(__dirname, "node/src/routes/admin/profile.router"));
const authAdmin = require(path.join(__dirname, "node/src/routes/admin/auth.router"));
const cardMiddleware=require(path.join(__dirname, "node/src/middleware/client/card.middleware"));
const userMiddleware=require(path.join(__dirname, "node/src/middleware/client/user.middleware"));
const generalSetting=require(path.join(__dirname, "node/src/middleware/admin/setting-gereral.middleware"));
const rolesAdmin = require(path.join(__dirname, "node/src/routes/admin/roles.router"));
const accountAdmin = require(path.join(__dirname, "node/src/routes/admin/account-router"));
const productCateroryAdmin=require(path.join(__dirname,"node/src/routes/admin/product-category"))
const middlewareAuth =require(path.join(__dirname, "node/src/middleware/admin/auth.middleware"));



//hien thi thong bao khi thay doi tang trang thai app.use(express.cookieParser('keyboard cat'));
// app.use(limiter);

app.use(cookieParser('nguyenvansamthichdangthithuy'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//

const server = http.createServer(app);
const io = new Server(server);


global._io = io; // tạo ra một biến dùng chung cho cả server

app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true }));
const systemAdmin = require("./node/src/config/system");
// override method post, put, delete
app.use(methodOverride('_method'))

configPug(app); 
app.use("", webRouter);
 app.use(middlewareCaterory.Category)
 app.use(generalSetting.settingGeneral)
app.use(userMiddleware.userMiddleware)
 app.use(cardMiddleware.cardId)
app.use(prefixAdmin.prefixAdmin, authAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, settingGeneral);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, accountAdmin);
app.use(prefixAdmin.prefixAdmin, detailProfile)
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, rolesAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, productAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, productCateroryAdmin);
app.use("", clienRouter);

// tao mot bien toan cuj de su dung trong cac file pug 
app.use(prefixAdmin.prefixAdmin, routeradmin);

//tinyEcm
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//end tinyEcm
app.locals.prefixAdmin = systemAdmin.prefixAdmin;
app.locals.moment = moment; // Để sử dụng moment trong các file Pug
// Thêm vào trước các app.use cho router
connection();

server.listen(port, () => {
  console.log(` app listening on port ${port}`);
});