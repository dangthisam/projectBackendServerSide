const User=require("../../models/user.model")

module.exports.userMiddleware=async (req,res,next)=>{
    // Ưu tiên kiểm tra session trước (phương thức mới)
    if(req.session && req.session.user){
        // Lấy thông tin user từ session
        const user = await User.findOne({
            _id: req.session.user.id,
            deleted: false,
            status: "active"
        });
        
        if(user){
            res.locals.users = user;
        }
    }
    // Fallback: Kiểm tra cookie (backward compatibility cho reset password flow)
    else {
        const tokenUser = req.cookies.tokenUser;
        if(tokenUser){
            const user = await User.findOne({
                tokenUser: tokenUser,
                deleted: false,
                status: "active"
            });
            
            if(user){
                res.locals.users = user;
            }
        }
    }
    
    next();
}