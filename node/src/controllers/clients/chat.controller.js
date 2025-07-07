

const chat=async (req, res)=>{
    res.render("clients/pages/chat/chat.pug",{
        title:"chat"
    })
}


module.exports={chat}