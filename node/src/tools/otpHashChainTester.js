const HashChainService = require('../services/hashChainService');

class OTPHashChainTester {
  
  /**
   * Demo đầy đủ thuật toán Hash Chain OTP
   */
  static demonstrateHashChain() {
    console.log('='.repeat(60));
    console.log('DEMO THUẬT TOÁN HASH CHAIN OTP');
    console.log('='.repeat(60));
    
    // Bước 1: Khởi tạo
    console.log('\n1. GIAI ĐOẠN KHỞI TẠO (Initialization)');
    console.log('-'.repeat(40));
    
    const seed = HashChainService.generateSeed();
    console.log(`Seed bí mật (s): ${seed}`);
    console.log(`Độ dài seed: ${seed.length * 4} bits`);
    
    const maxIterations = 10; // Dùng 10 để demo cho dễ nhìn
    console.log(`Số lần băm tối đa (n): ${maxIterations}`);
    
    // Tính verifier = f^n(s)
    const verifier = HashChainService.generateVerifier(seed, maxIterations);
    console.log(`Verifier = f^${maxIterations}(s): ${verifier}`);
    console.log('→ Server lưu verifier này, không biết seed s');
    
    // Bước 2: Tạo chuỗi OTP
    console.log('\n2. CHUỖI OTP ĐƯỢC TẠO');
    console.log('-'.repeat(40));
    
    const otpSequence = [];
    for (let i = 0; i < maxIterations; i++) {
      const otp = HashChainService.generateOTP(seed, maxIterations, i);
      otpSequence.push({
        iteration: i + 1,
        hashTimes: maxIterations - i - 1,
        otp: otp,
        shortOtp: otp.substring(0, 12)
      });
    }
    
    console.log('Lần | Công thức        | OTP (12 ký tự đầu)');
    console.log('-'.repeat(50));
    otpSequence.forEach(item => {
      console.log(`${item.iteration.toString().padStart(3)} | f^${item.hashTimes.toString().padStart(2)}(s)          | ${item.shortOtp}`);
    });
    
    // Bước 3: Mô phỏng quá trình đăng nhập
    console.log('\n3. MÔ PHỎNG QUÁ TRÌNH ĐĂNG NHẬP');
    console.log('-'.repeat(40));
    
    let currentVerifier = verifier;
    
    for (let loginAttempt = 0; loginAttempt < Math.min(5, maxIterations); loginAttempt++) {
      console.log(`\nLần đăng nhập ${loginAttempt + 1}:`);
      
      const currentOTP = otpSequence[loginAttempt].otp;
      console.log(`  Client gửi OTP: ${currentOTP.substring(0, 12)}...`);
      
      // Server kiểm tra
      const isValid = HashChainService.verifyOTP(currentOTP, currentVerifier);
      console.log(`  Server kiểm tra: f(OTP) === verifier?`);
      console.log(`  Kết quả: ${isValid ? '✅ THÀNH CÔNG' : '❌ THẤT BẠI'}`);
      
      if (isValid) {
        // Cập nhật verifier
        currentVerifier = currentOTP;
        console.log(`  Server cập nhật verifier = OTP hiện tại`);
        console.log(`  Verifier mới: ${currentVerifier.substring(0, 12)}...`);
      }
    }
    
    console.log('\n4. TÍNH CHẤT BẢO MẬT');
    console.log('-'.repeat(40));
    console.log('✓ Server không bao giờ biết seed s');
    console.log('✓ Mỗi OTP chỉ dùng được 1 lần');
    console.log('✓ Không thể tính ngược từ OTP về seed');
    console.log('✓ Không thể đoán OTP tiếp theo từ OTP hiện tại');
    console.log('✓ Kẻ tấn công nghe lén OTP cũ không thể đăng nhập');
    
    return {
      seed,
      verifier,
      otpSequence,
      maxIterations
    };
  }
  
  /**
   * Test tính đúng đắn của thuật toán
   */
  static testAlgorithmCorrectness() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST TÍNH ĐÚNG ĐẮN CỦA THUẬT TOÁN');
    console.log('='.repeat(60));
    
    const seed = HashChainService.generateSeed();
    const n = 5;
    
    console.log(`Seed: ${seed.substring(0, 16)}...`);
    console.log(`n = ${n}`);
    
    // Test 1: Verifier phải bằng f^n(seed)
    const verifier = HashChainService.generateVerifier(seed, n);
    const manualVerifier = HashChainService.applyHashNTimes(seed, n);
    
    console.log(`\nTest 1: Verifier = f^${n}(seed)`);
    console.log(`Kết quả: ${verifier === manualVerifier ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 2: OTP_i = f^(n-i-1)(seed)
    console.log(`\nTest 2: OTP công thức`);
    for (let i = 0; i < n; i++) {
      const otp = HashChainService.generateOTP(seed, n, i);
      const expectedHashTimes = n - i - 1;
      const manualOTP = HashChainService.applyHashNTimes(seed, expectedHashTimes);
      
      const isCorrect = otp === manualOTP;
      console.log(`  OTP_${i+1} = f^${expectedHashTimes}(seed): ${isCorrect ? '✅' : '❌'}`);
    }
    
    // Test 3: Chuỗi xác thực
    console.log(`\nTest 3: Chuỗi xác thực`);
    let currentVerifier = verifier;
    let allValid = true;
    
    for (let i = 0; i < n; i++) {
      const otp = HashChainService.generateOTP(seed, n, i);
      const isValid = HashChainService.verifyOTP(otp, currentVerifier);
      
      console.log(`  Lần ${i+1}: ${isValid ? '✅' : '❌'}`);
      
      if (!isValid) {
        allValid = false;
      } else {
        currentVerifier = otp;
      }
    }
    
    console.log(`\nKết quả tổng thể: ${allValid ? '✅ TẤT CẢ PASS' : '❌ CÓ LỖI'}`);
    
    return allValid;
  }
  
  /**
   * Benchmark hiệu suất
   */
  static benchmarkPerformance() {
    console.log('\n' + '='.repeat(60));
    console.log('BENCHMARK HIỆU SUẤT');
    console.log('='.repeat(60));
    
    const iterations = [10, 50, 100, 500, 1000];
    
    iterations.forEach(n => {
      const seed = HashChainService.generateSeed();
      
      // Test tốc độ tạo verifier
      const startTime = Date.now();
      const verifier = HashChainService.generateVerifier(seed, n);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      console.log(`n=${n.toString().padStart(4)}: ${duration.toString().padStart(4)}ms để tạo verifier`);
    });
    
    // Test tốc độ xác thực
    console.log('\nTốc độ xác thực OTP:');
    const seed = HashChainService.generateSeed();
    const testOTP = HashChainService.generateOTP(seed, 100, 0);
    const testVerifier = HashChainService.generateVerifier(seed, 100);
    
    const iterations_test = 10000;
    const startTime = Date.now();
    
    for (let i = 0; i < iterations_test; i++) {
      HashChainService.verifyOTP(testOTP, testVerifier);
    }
    
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / iterations_test;
    
    console.log(`${iterations_test} lần xác thực: ${avgTime.toFixed(3)}ms/lần`);
  }
}

// Chạy demo nếu file được gọi trực tiếp
if (require.main === module) {
  console.log('HASH CHAIN OTP TESTER');
  console.log('Chọn chế độ:');
  console.log('1. Demo thuật toán');
  console.log('2. Test tính đúng đắn');
  console.log('3. Benchmark hiệu suất');
  console.log('4. Chạy tất cả');
  
  const mode = process.argv[2] || '1';
  
  switch (mode) {
    case '1':
      OTPHashChainTester.demonstrateHashChain();
      break;
    case '2':
      OTPHashChainTester.testAlgorithmCorrectness();
      break;
    case '3':
      OTPHashChainTester.benchmarkPerformance();
      break;
    case '4':
      OTPHashChainTester.demonstrateHashChain();
      OTPHashChainTester.testAlgorithmCorrectness();
      OTPHashChainTester.benchmarkPerformance();
      break;
    default:
      console.log('Chế độ không hợp lệ. Sử dụng: node otpHashChainTester.js [1|2|3|4]');
  }
}

module.exports = OTPHashChainTester;