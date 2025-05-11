const path = require("path");
const express = require("express");
// const configViewEngine = (app) => {
//   app.set("views", path.join("./node/src", "views"));
//   app.set("view engine", "ejs");
//   app.use(express.static(path.join("./node/src", "public")));
//   console.log(path.resolve("public"));
// };

const configPug=(app) => {
  app.set("views", path.join("./node/src", "views"));
  app.set("view engine", "pug");
  app.use(express.static(path.join("./node/src", "public")));
};
module.exports = { configPug};
