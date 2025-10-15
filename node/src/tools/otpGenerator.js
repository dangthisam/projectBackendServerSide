const HashChainService = require('../services/hashChainService');

/**
 * OTP Generator Tool - Công cụ tạo OTP cho client
 * Sử dụng: node otpGenerator.js <seed> <maxIterations> <currentIteration>
 */
class OTPGenerator {
  
  /**
   * Tạo OTP từ command line
   */
  static generateFromCLI() {
    const args = process.argv.slice(2);
    
    if (args[0] === '--demo') {
      this.generateDemo();
      return;
    }
    
    if (args[0] === '--help') {
      this.showHelp();
      return;
    }
    
    if (args.length < 3) {
      console.log('Cách sử dụng: node otpGenerator.js <seed> <maxIterations> <currentIteration>');
      console.log('');
      console.log('Ví dụ:');
      console.log('  node otpGenerator.js abc123def456 100 1    # Tạo OTP cho lần đăng nhập đầu tiên');
      console.log('  node otpGenerator.js abc123def456 100 5    # Tạo OTP cho lần đăng nhập thứ 5');
      console.log('');
      console.log('Hoặc sử dụng các lệnh đặc biệt:');
      console.log('  node otpGenerator.js --demo                # Tạo demo với seed ngẫu nhiên');
      console.log('  node otpGenerator.js --help                # Hiển thị hướng dẫn');
      return;
    }
    
    const [seed, maxIterations, currentIteration] = args;
    const maxIter = parseInt(maxIterations);
    const currentIter = parseInt(currentIteration);
    
    if (isNaN(maxIter) || isNaN(currentIter)) {
      console.error('❌ Lỗi: maxIterations và currentIteration phải là số');
      return;
    }
    
    if (currentIter < 1 || currentIter > maxIter) {
      console.error(`❌ Lỗi: currentIteration phải từ 1 đến ${maxIter}`);
      return;
    }
    
    try {
      // Tính OTP (currentIteration bắt đầu từ 1, nhưng array index từ 0)
      const otp = HashChainService.generateOTP(seed, maxIter, currentIter - 1);
      const hashTimes = maxIter - currentIter;
      
      console.log('='.repeat(50));
      console.log('OTP GENERATOR RESULT');
      console.log('='.repeat(50));
      console.log(`Seed: ${seed}`);
      console.log(`Max iterations: ${maxIter}`);
      console.log(`Current iteration: ${currentIter}`);
      console.log(`Hash times: f^${hashTimes}(seed)`);
      console.log(`OTP: ${otp}`);
      console.log(`OTP (short): ${otp.substring(0, 12)}...`);
      console.log('='.repeat(50));
      
      // Verify với verifier nếu có
      if (args[3]) {
        const verifier = args[3];
        const isValid = HashChainService.verifyOTP(otp, verifier);
        console.log(`Verification with provided verifier: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
      
    } catch (error) {
      console.error('❌ Lỗi:', error.message);
    }
  }
  
  /**
   * Tạo demo với seed ngẫu nhiên
   */
  static generateDemo() {
    console.log('='.repeat(60));
    console.log('DEMO OTP GENERATOR');
    console.log('='.repeat(60));
    
    const seed = HashChainService.generateSeed();
    const maxIterations = 10;
    
    console.log(`Generated seed: ${seed}`);
    console.log(`Max iterations: ${maxIterations}`);
    console.log('');
    
    // Tạo verifier
    const verifier = HashChainService.generateVerifier(seed, maxIterations);
    console.log(`Verifier (for server): ${verifier}`);
    console.log('');
    
    // Tạo chuỗi OTP
    console.log('OTP Sequence:');
    console.log('Lần | Công thức     | OTP (12 ký tự đầu) | OTP đầy đủ');
    console.log('-'.repeat(80));
    
    for (let i = 1; i <= maxIterations; i++) {
      const otp = HashChainService.generateOTP(seed, maxIterations, i - 1);
      const hashTimes = maxIterations - i;
      console.log(`${i.toString().padStart(3)} | f^${hashTimes.toString().padStart(2)}(seed)    | ${otp.substring(0, 12).padEnd(18)} | ${otp}`);
    }
    
    console.log('');
    console.log('Để sử dụng:');
    console.log(`node otpGenerator.js ${seed} ${maxIterations} 1    # Lần đăng nhập đầu tiên`);
    console.log(`node otpGenerator.js ${seed} ${maxIterations} 2    # Lần đăng nhập thứ hai`);
    console.log('...');
  }
  
  /**
   * Hiển thị hướng dẫn chi tiết
   */
  static showHelp() {
    console.log('='.repeat(60));
    console.log('OTP GENERATOR - HƯỚNG DẪN SỬ DỤNG');
    console.log('='.repeat(60));
    console.log('');
    console.log('THUẬT TOÁN HASH CHAIN OTP:');
    console.log('1. Khởi tạo: Tạo seed bí mật s, tính verifier = f^n(s)');
    console.log('2. Đăng nhập lần i: OTP_i = f^(n-i)(s)');
    console.log('3. Server xác thực: f(OTP_i) === verifier_current');
    console.log('4. Cập nhật: verifier_new = OTP_i');
    console.log('');
    console.log('CÁCH SỬ DỤNG:');
    console.log('');
    console.log('1. Tạo OTP cụ thể:');
    console.log('   node otpGenerator.js <seed> <maxIterations> <currentIteration>');
    console.log('');
    console.log('   Ví dụ:');
    console.log('   node otpGenerator.js abc123 100 1     # OTP cho lần đăng nhập đầu tiên');
    console.log('   node otpGenerator.js abc123 100 50    # OTP cho lần đăng nhập thứ 50');
    console.log('');
    console.log('2. Tạo demo:');
    console.log('   node otpGenerator.js --demo');
    console.log('');
    console.log('3. Hiển thị hướng dẫn:');
    console.log('   node otpGenerator.js --help');
    console.log('');
    console.log('THAM SỐ:');
    console.log('- seed: Chuỗi bí mật ban đầu (hex string)');
    console.log('- maxIterations: Tổng số lần đăng nhập tối đa (n)');
    console.log('- currentIteration: Lần đăng nhập hiện tại (1, 2, 3, ...)');
    console.log('');
    console.log('LƯU Ý BẢO MẬT:');
    console.log('- Giữ bí mật seed, không chia sẻ với ai');
    console.log('- Mỗi OTP chỉ sử dụng 1 lần theo thứ tự');
    console.log('- Khi hết OTP, cần tạo seed mới và đăng ký lại');
  }
  
  /**
   * Tạo multiple OTP cho nhiều lần đăng nhập
   */
  static generateMultiple(seed, maxIterations, startIteration, count) {
    console.log('='.repeat(60));
    console.log(`GENERATING ${count} OTPs`);
    console.log('='.repeat(60));
    
    const otps = [];
    
    for (let i = 0; i < count; i++) {
      const currentIteration = startIteration + i;
      
      if (currentIteration > maxIterations) {
        console.log(`⚠️  Dừng tại iteration ${currentIteration - 1} (vượt quá max ${maxIterations})`);
        break;
      }
      
      try {
        const otp = HashChainService.generateOTP(seed, maxIterations, currentIteration - 1);
        otps.push({
          iteration: currentIteration,
          otp: otp,
          shortOtp: otp.substring(0, 12)
        });
      } catch (error) {
        console.error(`❌ Lỗi tại iteration ${currentIteration}:`, error.message);
        break;
      }
    }
    
    console.log('Lần | OTP (12 ký tự đầu) | OTP đầy đủ');
    console.log('-'.repeat(70));
    otps.forEach(item => {
      console.log(`${item.iteration.toString().padStart(3)} | ${item.shortOtp.padEnd(18)} | ${item.otp}`);
    });
    
    return otps;
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  OTPGenerator.generateFromCLI();
}

module.exports = OTPGenerator;