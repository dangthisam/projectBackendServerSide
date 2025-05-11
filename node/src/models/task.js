const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const User = new mongoose.Schema({
  code: String,
  name: String,
  address: String,
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: String,
  end: String,
  description: String,
});
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: String,
    startDate: String,
    endDate: String,
    description: String,
    userInfo: User,
    projectInfor: projectSchema,
  },
  {
    timestamps: true,
  }
);
taskSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Task = new mongoose.model("Task", taskSchema);
module.exports = Task;
