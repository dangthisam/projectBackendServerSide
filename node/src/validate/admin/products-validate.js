// Ensure this file exports the createProducts method
module.exports.createProducts=(req,res , next) =>{
    if(!req.body.title){
        req.flash('error', 'Vui lòng nhập tên sản phẩm!');
        res.redirect("back");
        return;
    }
    next();
    // other exports
    
};