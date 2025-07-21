

const chat=async (req, res)=>{

    _io.on('connection', (socket) => {
      console.log('a user connected' , socket.id);
    })
    res.render("clients/pages/chat/chat.pug",{
        title:"chat"
    })
}


module.exports={chat}