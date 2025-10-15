const axios = require('axios').default;
const HashChainService = require('../services/hashChainService');

class SystemTester {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    this.testResults.push({
      timestamp,
      type,
      message
    });
  }

  async testAPI(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 0,
        error: error.response?.data || error.message
      };
    }
  }

  async testRegistration() {
    this.log('='.repeat(50));
    this.log('TESTING USER REGISTRATION');
    this.log('='.repeat(50));

    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`
    };

    this.log(`Testing registration with user: ${testUser.username}`);

    const result = await this.testAPI('POST', '/otp-auth/register', testUser);

    if (result.success && result.data.success) {
      this.log('✅ Registration successful', 'success');
      this.log(`User ID: ${result.data.data.userId}`);
      this.log(`Seed: ${result.data.data.seed.substring(0, 16)}...`);
      this.log(`Max iterations: ${result.data.data.maxIterations}`);
      
      return {
        success: true,
        userData: result.data.data,
        testUser
      };
    } else {
      this.log('❌ Registration failed', 'error');
      this.log(`Error: ${JSON.stringify(result.error)}`);
      return { success: false };
    }
  }

  async testLogin(userData, testUser) {
    this.log('='.repeat(50));
    this.log('TESTING USER LOGIN');
    this.log('='.repeat(50));

    const { seed, maxIterations } = userData;
    
    // Tạo OTP cho lần đăng nhập đầu tiên
    const otp = HashChainService.generateOTP(seed, maxIterations, 0);
    this.log(`Generated OTP for first login: ${otp.substring(0, 16)}...`);

    const loginData = {
      username: testUser.username,
      otp: otp
    };

    const result = await this.testAPI('POST', '/otp-auth/login', loginData);

    if (result.success && result.data.success) {
      this.log('✅ Login successful', 'success');
      this.log(`Remaining logins: ${result.data.data.remainingLogins}`);
      return { success: true, loginData: result.data.data };
    } else {
      this.log('❌ Login failed', 'error');
      this.log(`Error: ${JSON.stringify(result.error)}`);
      return { success: false };
    }
  }

  async testMultipleLogins(userData, testUser, count = 3) {
    this.log('='.repeat(50));
    this.log(`TESTING MULTIPLE LOGINS (${count} times)`);
    this.log('='.repeat(50));

    const { seed, maxIterations } = userData;
    let successCount = 0;

    for (let i = 0; i < count; i++) {
      this.log(`\nLogin attempt ${i + 1}:`);
      
      // Tạo OTP cho lần đăng nhập thứ i+1 (vì đã login 1 lần rồi)
      const otp = HashChainService.generateOTP(seed, maxIterations, i + 1);
      
      const loginData = {
        username: testUser.username,
        otp: otp
      };

      const result = await this.testAPI('POST', '/otp-auth/login', loginData);

      if (result.success && result.data.success) {
        successCount++;
        this.log(`  ✅ Login ${i + 1} successful - Remaining: ${result.data.data.remainingLogins}`);
      } else {
        this.log(`  ❌ Login ${i + 1} failed - ${JSON.stringify(result.error)}`);
      }
    }

    this.log(`\nMultiple login test completed: ${successCount}/${count} successful`);
    return { successCount, totalAttempts: count };
  }

  async testInvalidOTP(testUser) {
    this.log('='.repeat(50));
    this.log('TESTING INVALID OTP');
    this.log('='.repeat(50));

    const invalidOTP = 'invalid_otp_12345';
    const loginData = {
      username: testUser.username,
      otp: invalidOTP
    };

    const result = await this.testAPI('POST', '/otp-auth/login', loginData);

    if (!result.success || !result.data.success) {
      this.log('✅ Invalid OTP correctly rejected', 'success');
      return { success: true };
    } else {
      this.log('❌ Invalid OTP was accepted (security issue!)', 'error');
      return { success: false };
    }
  }

  async testReplayAttack(userData, testUser) {
    this.log('='.repeat(50));
    this.log('TESTING REPLAY ATTACK PROTECTION');
    this.log('='.repeat(50));

    const { seed, maxIterations } = userData;
    
    // Sử dụng lại OTP đã dùng (OTP đầu tiên)
    const oldOTP = HashChainService.generateOTP(seed, maxIterations, 0);
    
    const loginData = {
      username: testUser.username,
      otp: oldOTP
    };

    const result = await this.testAPI('POST', '/otp-auth/login', loginData);

    if (!result.success || !result.data.success) {
      this.log('✅ Replay attack correctly prevented', 'success');
      return { success: true };
    } else {
      this.log('❌ Replay attack succeeded (security issue!)', 'error');
      return { success: false };
    }
  }

  async testHashChainAlgorithm() {
    this.log('='.repeat(50));
    this.log('TESTING HASH CHAIN ALGORITHM');
    this.log('='.repeat(50));

    const seed = HashChainService.generateSeed();
    const n = 10;
    
    this.log(`Testing with seed: ${seed.substring(0, 16)}... and n=${n}`);

    // Test 1: Verifier calculation
    const verifier = HashChainService.generateVerifier(seed, n);
    const manualVerifier = HashChainService.applyHashNTimes(seed, n);
    
    if (verifier === manualVerifier) {
      this.log('✅ Verifier calculation correct', 'success');
    } else {
      this.log('❌ Verifier calculation incorrect', 'error');
      return { success: false };
    }

    // Test 2: OTP sequence validation
    let currentVerifier = verifier;
    let allValid = true;

    for (let i = 0; i < n; i++) {
      const otp = HashChainService.generateOTP(seed, n, i);
      const isValid = HashChainService.verifyOTP(otp, currentVerifier);
      
      if (isValid) {
        currentVerifier = otp;
        this.log(`  ✅ OTP ${i + 1} valid`);
      } else {
        this.log(`  ❌ OTP ${i + 1} invalid`);
        allValid = false;
        break;
      }
    }

    if (allValid) {
      this.log('✅ Hash chain algorithm working correctly', 'success');
      return { success: true };
    } else {
      this.log('❌ Hash chain algorithm has issues', 'error');
      return { success: false };
    }
  }

  async runFullTest() {
    this.log('🚀 STARTING FULL SYSTEM TEST');
    this.log(`Base URL: ${this.baseURL}`);
    
    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;

    try {
      // Test 1: Hash Chain Algorithm
      totalTests++;
      const algorithmTest = await this.testHashChainAlgorithm();
      if (algorithmTest.success) passedTests++;

      // Test 2: User Registration
      totalTests++;
      const registrationTest = await this.testRegistration();
      if (!registrationTest.success) {
        this.log('❌ Cannot continue without successful registration', 'error');
        return this.generateReport(startTime, totalTests, passedTests);
      }
      passedTests++;

      const { userData, testUser } = registrationTest;

      // Test 3: First Login
      totalTests++;
      const loginTest = await this.testLogin(userData, testUser);
      if (loginTest.success) passedTests++;

      // Test 4: Multiple Logins
      totalTests++;
      const multipleLoginTest = await this.testMultipleLogins(userData, testUser, 3);
      if (multipleLoginTest.successCount === multipleLoginTest.totalAttempts) passedTests++;

      // Test 5: Invalid OTP
      totalTests++;
      const invalidOTPTest = await this.testInvalidOTP(testUser);
      if (invalidOTPTest.success) passedTests++;

      // Test 6: Replay Attack Protection
      totalTests++;
      const replayTest = await this.testReplayAttack(userData, testUser);
      if (replayTest.success) passedTests++;

    } catch (error) {
      this.log(`❌ Test suite failed with error: ${error.message}`, 'error');
    }

    return this.generateReport(startTime, totalTests, passedTests);
  }

  generateReport(startTime, totalTests, passedTests) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    this.log('='.repeat(60));
    this.log('TEST REPORT');
    this.log('='.repeat(60));
    this.log(`Total Tests: ${totalTests}`);
    this.log(`Passed: ${passedTests}`);
    this.log(`Failed: ${totalTests - passedTests}`);
    this.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    this.log(`Duration: ${duration}ms`);
    
    if (passedTests === totalTests) {
      this.log('🎉 ALL TESTS PASSED!', 'success');
    } else {
      this.log('⚠️  SOME TESTS FAILED', 'error');
    }

    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: (passedTests / totalTests) * 100,
      duration,
      allPassed: passedTests === totalTests
    };
  }
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  const baseURL = process.argv[2] || 'http://localhost:3001';
  const tester = new SystemTester(baseURL);
  
  tester.runFullTest().then(report => {
    process.exit(report.allPassed ? 0 : 1);
  }).catch(error => {
    console.error('Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = SystemTester;