const { get } = require("../routes/web");
const connection = require("../config/db");
const User = require("../models/user");
// const getHomePage = (req, res) => {
//   connection.query(
//     "SELECT * FROM `KhachHang` ",
//     function (err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );
//   res.send("helloword");
// };

const get1 = (req, res) => {
  res.render("sample.ejs");
};
const getAPI = (req, res) => {
  res.send("tao la sam day nha em");
};
// const postUser = (req, res) => {
//   console.log("req.body>>> :", req.body);
//   let code = req.body.code;
//   let name = req.body.name;

//   let address = req.body.address;
//   // connection.query(
//   //   "INSERT INTO KhachHang(TenKH, DiaChiKH)  VALUES (?, ? ) ",
//   //   [name, address],
//   //   function (err, results) {
//   //     console.log(results);
//   //   }
//   // );
//   User.create({
//     code: code,
//     name: name,
//     address: address,
//   });
//   res.send("sam ok");
// };
const createrpostUser = (req, res) => {
  res.render("creater_user.ejs");
};
// module.exports = {
//   getAPI,
//   get1,

//   createrpostUser,
// };
