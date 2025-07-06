User = require("../../models/user.model");

const authMiddleware = async (req, res, next) => {
  if (!req.cookies.userToken) {
    req.flash("error", "Bạn cần đăng nhập để thực hiện chức năng này");
    return res.redirect("/user/login");
  }
  else{

    const user = await User.findOne({ token:  req.cookies.token }).select("-password ");
    if (!user) {
      req.flash("error", "Phiên đăng nhập không hợp lệ");
      return res.redirect("/user/login");
    }else{
       res.locals.user = user;
        next();
    }
  }
};

module.exports = {
    authMiddleware,
};

