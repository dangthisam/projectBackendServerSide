const mongoose = require("mongoose");
const newSchema = new mongoose.Schema(
  {
    titte:String,
    description:String,
    image:String
    
  },
  { timestamps: true }
);


const New= mongoose.model(New, newSchema, "news");
module.exports = New;
