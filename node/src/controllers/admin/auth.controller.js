const Account = require('../../models/account'); // Assuming you have an Account model
const md5 = require('md5'); // Assuming you are using md5 for password hashing

const systemConfig = require('../../config/system'); // Assuming you have a system config file
const authLogin = async (req, res) => {
  // Render the login page
 res.render('admin/pages/auth/login', {
    title: 'Login Page',
    layout: 'admin/layouts/auth-layout' // Use the auth layout for the login page
  });
}


const loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password; // Get the plain text password
  const user = await Account.findOne({
    email: email,
    deleted: false // Ensure the account is not deleted
  });

  if (!user) {
    // If user not found, redirect to login with error message
    req.flash('error', 'Invalid email or password');
    return res.redirect("back");
  }

  if (md5(password) != user.password) {
    // If password does not match, redirect to login with error message
    req.flash('error', 'Invalid password');
    return res.redirect("back");
  }
  if (user.status == 'inactive') {
    // If user is inactive, redirect to login with error message
    req.flash('error', 'Your account is inactive. Please contact support.');
    return res.redirect("back");
  }
  res.cookie("token", user.token, {

    httpOnly: true, // Make cookie HTTP only for security
    secure: false // Set to true if using HTTPS
  });
  res.redirect('/admin/dashboard'); // Redirect to the dashboard or home page after successful login
}

module.exports = {
  authLogin,
  loginPost
};