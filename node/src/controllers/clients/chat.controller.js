
const Chat = require("../../models/chat.model")
const User=require("../../models/user.model");
const chat=async (req, res)=>{
  const userId=res.locals.user.id;

    _io.once('connection',  (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (content) => {
     const newChat =new Chat({
      userId:userId,
      content:content
     });
  await    newChat.save();
    });
  })

  const chats =await Chat.find({
    deleted:false
  })

for (const chat of chats ){
 const infoUser=await User.findOne({
  _id:chat.userId,
  deleted:false
 })
 chat.infoUser=infoUser;
}




  res.render("clients/pages/chat/chat.pug",{
      title:"chat",
      chats:chats
  })
}


module.exports={chat}