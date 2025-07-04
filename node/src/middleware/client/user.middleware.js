const User=require("../../models/user.model")

module.exports.userMiddleware=async (req,res,next)=>{

    const tokenUser=req.cookies.tokenUser;
    if(tokenUser){
        const user=await User.findOne({
            tokenUser:tokenUser,
            deleted:false,
            status:"active"

        })
        
       res.locals.users=user;
    
}
 next();
}