const Account = require("../../models/account")
const systemConfig = require("../../config/system");

const authMiddleware = (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "Bạn cần đăng nhập để thực hiện chức năng này");
    return res.redirect("/admin/auth/login");
  }
  else{
    const token = req.cookies.token;
    const user = Account.findOne({ token: token, deleted: false });
    if (!user) {
      req.flash("error", "Phiên đăng nhập không hợp lệ");
      return res.redirect("/admin/auth/login");
    }else{
        next();
    }
  }
};

module.exports = {
    authMiddleware,
};

