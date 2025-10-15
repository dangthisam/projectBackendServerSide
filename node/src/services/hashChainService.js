const crypto = require('crypto');

class HashChainService {
  /**
   * Tạo seed ngẫu nhiên 256 bits
   * @returns {string} Seed hex string
   */
  static generateSeed() {
    return crypto.randomBytes(32).toString('hex'); // 256 bits = 32 bytes
  }

  /**
   * Hàm băm một chiều sử dụng SHA-256
   * @param {string} input - Giá trị đầu vào
   * @returns {string} Giá trị băm hex
   */
  static hashFunction(input) {
    return crypto.createHash('sha256').update(input, 'hex').digest('hex');
  }

  /**
   * Áp dụng hàm băm n lần
   * @param {string} seed - Giá trị seed ban đầu
   * @param {number} n - Số lần băm
   * @returns {string} Kết quả sau n lần băm
   */
  static applyHashNTimes(seed, n) {
    let result = seed;
    for (let i = 0; i < n; i++) {
      result = this.hashFunction(result);
    }
    return result;
  }

  /**
   * Tạo verifier cho giai đoạn khởi tạo
   * @param {string} seed - Seed bí mật
   * @param {number} maxIterations - Số lần băm tối đa (n)
   * @returns {string} Verifier = f^n(seed)
   */
  static generateVerifier(seed, maxIterations = 100) {
    return this.applyHashNTimes(seed, maxIterations);
  }

  /**
   * Tạo OTP cho lần đăng nhập thứ i
   * @param {string} seed - Seed bí mật
   * @param {number} maxIterations - Số lần băm tối đa (n)
   * @param {number} currentIteration - Lần đăng nhập hiện tại (i)
   * @returns {string} OTP = f^(n-i)(seed)
   */
  static generateOTP(seed, maxIterations, currentIteration) {
    if (currentIteration >= maxIterations) {
      throw new Error('Đã hết số lần đăng nhập. Vui lòng đăng ký lại.');
    }
    
    const hashTimes = maxIterations - currentIteration - 1;
    return this.applyHashNTimes(seed, hashTimes);
  }

  /**
   * Xác thực OTP
   * @param {string} otp - OTP từ client
   * @param {string} currentVerifier - Verifier hiện tại trên server
   * @returns {boolean} True nếu OTP hợp lệ
   */
  static verifyOTP(otp, currentVerifier) {
    const hashedOTP = this.hashFunction(otp);
    return hashedOTP === currentVerifier;
  }

  /**
   * Tạo chuỗi OTP demo để test
   * @param {string} seed - Seed bí mật
   * @param {number} maxIterations - Số lần băm tối đa
   * @returns {Array} Mảng các OTP theo thứ tự sử dụng
   */
  static generateOTPSequence(seed, maxIterations = 10) {
    const sequence = [];
    for (let i = 0; i < maxIterations; i++) {
      const otp = this.generateOTP(seed, maxIterations, i);
      sequence.push({
        iteration: i + 1,
        otp: otp,
        shortOtp: otp.substring(0, 8) // Hiển thị 8 ký tự đầu cho dễ nhìn
      });
    }
    return sequence;
  }
}

module.exports = HashChainService;