const { get } = require("../routes/web");
const connection = require("../config/db");
const User = require("../models/user");

const get1 = (req, res) => {
  res.render("sample.ejs");
};
const getAPI = (req, res) => {
  res.send("tao la sam day nha em");
};

const createrpostUser = (req, res) => {
  res.render("creater_user.ejs");
};

