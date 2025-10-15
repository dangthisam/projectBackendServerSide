const OtpUser = require("../../models/otpUser");
const HashChainService = require("../../services/hashChainService");

class OtpAuthController {
  
  // [GET] /otp-auth/register
  static async registerPage(req, res) {
    try {
      res.render("client/pages/otp-auth/register", {
        pageTitle: "Đăng ký OTP Authentication"
      });
    } catch (error) {
      console.error("Error rendering register page:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi server" 
      });
    }
  }

  // [POST] /otp-auth/register
  static async register(req, res) {
    try {
      const { username, email } = req.body;

      // Kiểm tra input
      if (!username || !email) {
        return res.status(400).json({
          success: false,
          message: "Username và email là bắt buộc"
        });
      }

      // Kiểm tra user đã tồn tại
      const existingUser = await OtpUser.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username hoặc email đã tồn tại"
        });
      }

      // Tạo seed và verifier
      const seed = HashChainService.generateSeed();
      const maxIterations = 100;
      const verifier = HashChainService.generateVerifier(seed, maxIterations);

      // Lưu user vào database
      const newUser = new OtpUser({
        username,
        email,
        verifier,
        currentIndex: 0,
        maxIndex: maxIterations
      });

      await newUser.save();

      // Tạo chuỗi OTP demo (10 OTP đầu tiên để test)
      const otpSequence = HashChainService.generateOTPSequence(seed, 10);

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data: {
          userId: newUser._id,
          username: newUser.username,
          seed: seed, // Trong thực tế, không nên trả về seed
          maxIterations: maxIterations,
          otpSequence: otpSequence // Demo sequence để test
        }
      });

    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi đăng ký"
      });
    }
  }

  // [GET] /otp-auth/login
  static async loginPage(req, res) {
    try {
      res.render("client/pages/otp-auth/login", {
        pageTitle: "Đăng nhập OTP Authentication"
      });
    } catch (error) {
      console.error("Error rendering login page:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi server" 
      });
    }
  }

  // [POST] /otp-auth/login
  static async login(req, res) {
    try {
      const { username, otp } = req.body;

      // Kiểm tra input
      if (!username || !otp) {
        return res.status(400).json({
          success: false,
          message: "Username và OTP là bắt buộc"
        });
      }

      // Tìm user
      const user = await OtpUser.findOne({ username, isActive: true });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User không tồn tại hoặc đã bị vô hiệu hóa"
        });
      }

      // Kiểm tra còn OTP không
      if (user.currentIndex >= user.maxIndex) {
        return res.status(400).json({
          success: false,
          message: "Đã hết số lần đăng nhập. Vui lòng đăng ký lại."
        });
      }

      // Xác thực OTP
      const isValidOTP = HashChainService.verifyOTP(otp, user.verifier);
      
      if (!isValidOTP) {
        return res.status(401).json({
          success: false,
          message: "OTP không hợp lệ"
        });
      }

      // Cập nhật verifier và currentIndex
      user.verifier = otp; // OTP hiện tại trở thành verifier mới
      user.currentIndex += 1;
      user.lastLoginAt = new Date();
      await user.save();

      // Tạo session hoặc JWT token (ở đây dùng session đơn giản)
      req.session.otpUserId = user._id;
      req.session.otpUsername = user.username;

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          userId: user._id,
          username: user.username,
          remainingLogins: user.maxIndex - user.currentIndex,
          lastLoginAt: user.lastLoginAt
        }
      });

    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi đăng nhập"
      });
    }
  }

  // [GET] /otp-auth/profile
  static async profile(req, res) {
    try {
      // Kiểm tra session
      if (!req.session.otpUserId) {
        return res.status(401).json({
          success: false,
          message: "Chưa đăng nhập"
        });
      }

      const user = await OtpUser.findById(req.session.otpUserId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User không tồn tại"
        });
      }

      res.render("client/pages/otp-auth/profile", {
        pageTitle: "Thông tin tài khoản",
        user: {
          username: user.username,
          email: user.email,
          currentIndex: user.currentIndex,
          maxIndex: user.maxIndex,
          remainingLogins: user.maxIndex - user.currentIndex,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error("Error in profile:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server"
      });
    }
  }

  // [POST] /otp-auth/logout
  static async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Lỗi khi đăng xuất"
          });
        }
        
        res.status(200).json({
          success: true,
          message: "Đăng xuất thành công"
        });
      });
    } catch (error) {
      console.error("Error in logout:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server"
      });
    }
  }

  // [GET] /otp-auth/demo/:username - Tạo demo OTP sequence
  static async generateDemoOTP(req, res) {
    try {
      const { username } = req.params;
      
      const user = await OtpUser.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User không tồn tại"
        });
      }

      // Tạo seed mới và sequence demo
      const seed = HashChainService.generateSeed();
      const otpSequence = HashChainService.generateOTPSequence(seed, 10);

      res.status(200).json({
        success: true,
        message: "Demo OTP sequence",
        data: {
          username: user.username,
          currentIndex: user.currentIndex,
          remainingLogins: user.maxIndex - user.currentIndex,
          newSeed: seed,
          otpSequence: otpSequence,
          note: "Đây là demo sequence với seed mới. Để sử dụng, cần cập nhật verifier trong database."
        }
      });

    } catch (error) {
      console.error("Error generating demo OTP:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server"
      });
    }
  }
}

module.exports = OtpAuthController;