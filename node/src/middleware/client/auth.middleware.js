const User = require("../../models/user.model")

const authMiddleware = async (req, res, next) => {
  // Kiểm tra session trước (phương thức mới)
  if (!req.session || !req.session.user) {
    req.flash("error", "Bạn cần đăng nhập để thực hiện chức năng này");
    return res.redirect("/user/login");
  }

  const user = await User.findOne({ 
    _id: req.session.user.id,
    deleted: false,
    status: "active"
  }).select("-password");

  if (!user) {
    req.flash("error", "Phiên đăng nhập không hợp lệ");
    // Xóa session không hợp lệ
    req.session.destroy();
    return res.redirect("/user/login");
  }
  
  res.locals.user = user;
  next();
};

module.exports = {
  authMiddleware
};
