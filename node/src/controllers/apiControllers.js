const { name } = require("ejs");
const User = require("../models/user");
const { uploadFile, uploadMutipleFile } = require("../services/filesevices");
const getUsersAPI = async (req, res) => {
  let result = await User.find({});
  return res.status(200).json({
    errcode: 0,
    data: result,
  });
};

const postUser = (req, res) => {
  console.log("req.body>>> :", req.body);
  let code = req.body.code;
  let name = req.body.name;
  let address = req.body.address;
  let user = User.create({
    code: code,
    name: name,
    address: address,
  });
  return res.status(200).json({
    EC: 0,
    data: user,
  });
};

const putUser = async (req, res) => {
  let code = req.body.code;

  let name = req.body.name;

  let address = req.body.address;

  let userID = req.body.userID;
  let user = await User.updateOne(
    { _id: userID },
    { code: code },
    { name: name },
    { address: address }
  );
  return res.status(200).json({
    EC: 0,
    data: user,
  });
};
const deleteUser = async (req, res) => {
  let id = req.body.userID;
  let result = await User.deleteOne({
    _id: id,
  });
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

const postFile = async (req, res) => {
  console.log("req.file ==", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  let result = await uploadMutipleFile(req.files.image);
  console.log(result);

  return res.send("ok single");
};

module.exports = {
  getUsersAPI,
  postUser,
  putUser,
  deleteUser,
  postFile,
};
