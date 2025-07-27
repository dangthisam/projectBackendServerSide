
const mongoose =require("mongoose");
const chatSchema=new mongoose.Schema({
    userId:String,
    room_chat_id:String,
    content:String,
    images,Array,
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date
},{
    timestamps:true,
  
   
})

const chat = mongoose.model("Chat", chatSchema , "chats");

module.exports=chat;


