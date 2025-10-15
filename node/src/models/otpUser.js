const mongoose = require("mongoose");

const otpUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  verifier: {
    type: String,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true,
    default: 0
  },
  maxIndex: {
    type: Number,
    required: true,
    default: 100 // Số lần OTP tối đa
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index để tối ưu tìm kiếm
otpUserSchema.index({ username: 1 });
otpUserSchema.index({ email: 1 });

const OtpUser = mongoose.model("OtpUser", otpUserSchema, "otp_users");

module.exports = OtpUser;