require("dotenv").config();
const path = require("path");
const express = require("express");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const moment = require("moment");
const { RedisStore } = require('connect-redis');
const helmet = require("helmet");
const http = require('http');
const { Server } = require('socket.io');

const { configPug } = require(path.join(__dirname, "node/src/config/viewEngine"));
const clienRouter = require(path.join(__dirname, "node/src/routes/client/routerCliten"));
const webRouter = require(path.join(__dirname, "node/src/routes/web"));
const redisClient = require(path.join(__dirname, "node/src/config/redis"));
const middlewareCaterory = require(path.join(__dirname, "node/src/middleware/client/category.middleware"));
const prefixAdmin = require(path.join(__dirname, "node/src/config/system"));
const routeradmin = require(path.join(__dirname, "node/src/routes/admin/index.router"));
const settingGeneral = require(path.join(__dirname, "node/src/routes/admin/setting-general.router"));
const productAdmin = require(path.join(__dirname, "node/src/routes/admin/products.router"));
const detailProfile = require(path.join(__dirname, "node/src/routes/admin/profile.router"));
const authAdmin = require(path.join(__dirname, "node/src/routes/admin/auth.router"));
const cardMiddleware = require(path.join(__dirname, "node/src/middleware/client/card.middleware"));
const userMiddleware = require(path.join(__dirname, "node/src/middleware/client/user.middleware"));
const generalSetting = require(path.join(__dirname, "node/src/middleware/admin/setting-gereral.middleware"));
const rolesAdmin = require(path.join(__dirname, "node/src/routes/admin/roles.router"));
const accountAdmin = require(path.join(__dirname, "node/src/routes/admin/account-router"));
const productCateroryAdmin = require(path.join(__dirname, "node/src/routes/admin/product-category"));
const middlewareAuth = require(path.join(__dirname, "node/src/middleware/admin/auth.middleware"));
const systemAdmin = require("./node/src/config/system");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

app.use(cookieParser('nguyenvansamthichdangthithuy'));
let redisStore = new RedisStore({ client: redisClient });
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

configPug(app);
app.use("", webRouter);
app.use(middlewareCaterory.Category);
app.use(generalSetting.settingGeneral);
app.use(userMiddleware.userMiddleware);
app.use(cardMiddleware.cardId);
app.use(prefixAdmin.prefixAdmin, authAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, settingGeneral);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, accountAdmin);
app.use(prefixAdmin.prefixAdmin, detailProfile);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, rolesAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, productAdmin);
app.use(prefixAdmin.prefixAdmin, middlewareAuth.authMiddleware, productCateroryAdmin);
app.use("", clienRouter);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(prefixAdmin.prefixAdmin, routeradmin);
app.set('trust proxy', true);
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.locals.prefixAdmin = systemAdmin.prefixAdmin;
app.locals.moment = moment;

module.exports = { app, server };