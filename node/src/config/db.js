const mysql = require("mysql2");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("debug", true);
const { number } = require("joi");

  const connection = async()=>{
try {
  await mongoose.connect(process.env.DB_HOST);
  console.log(" conncet success")

} catch (error) {
  console.log(error);
  console.log("connect fail ")
  }
  }

module.exports = connection;
