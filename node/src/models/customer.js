const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");
const customerUser = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: String,
    address: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

customerUser.plugin(mongoose_delete, { overrideMethods: "all" });
const cusUser = mongoose.model("customer", customerUser);
module.exports = cusUser;
