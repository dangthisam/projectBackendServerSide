const mongoose = require("mongoose");

// thu vien khi ta xoa data thi no van con chu khong mat di data (deleted=true=>xoa roi va nguoc lai )
var mongoose_delete = require("mongoose-delete");

const customerUse = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const User = new mongoose.Schema({
  name: String,
  address: String,
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: String,
    endDate: String,
    description: String,
    customerInfor: customerUse,
    // customerInfor: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    userInfor: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    leader: User,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },

  {
    //trong ban ghi se co thoi gian taoj
    timestamps: true,
  }
);

const project = mongoose.model("project", projectSchema);
module.exports = project;
