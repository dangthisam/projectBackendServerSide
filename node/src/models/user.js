const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  code: String,
  name: String,
  address: String,
});
const User = mongoose.model("user", userSchema);
module.exports = User;
