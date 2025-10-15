# Test OTP Hash Chain System

## 🚀 Hướng dẫn test hệ thống

### 1. Chạy server
```bash
$env:PORT=3001; node server.js
```
Server sẽ chạy tại: http://localhost:3001

### 2. Test qua Web Interface

#### Đăng ký:
- Truy cập: http://localhost:3001/otp-auth/register
- Nhập username và email
- Lưu lại seed và chuỗi OTP từ response

#### Đăng nhập:
- Truy cập: http://localhost:3001/otp-auth/login  
- Nhập username và OTP đầu tiên từ chuỗi
- Kiểm tra profile sau khi đăng nhập thành công

### 3. Test qua API

#### Đăng ký user mới:
```bash
curl -X POST http://localhost:3001/otp-auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}'
```

#### Tạo OTP từ seed:
```bash
# Sử dụng seed từ response đăng ký
node node/src/tools/otpGenerator.js <SEED> 100 1
```

#### Đăng nhập:
```bash
curl -X POST http://localhost:3001/otp-auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","otp":"<OTP_FROM_GENERATOR>"}'
```

### 4. Test CLI Tools

#### Demo thuật toán:
```bash
node node/src/tools/otpHashChainTester.js 1
```

#### Tạo OTP sequence:
```bash
node node/src/tools/otpGenerator.js --demo
```

#### Test tính đúng đắn:
```bash
node node/src/tools/otpHashChainTester.js 2
```

### 5. Ví dụ thực tế

Từ log server, tôi thấy đã có user đăng ký thành công:
- Username: samnv
- Email: vansam09082004@gmail.com
- Verifier: 4c4fc2eb35576c5ec052733a6a714794652be05f4bf86ce299c719b50eec6be5

Để test user này, bạn cần:
1. Lấy seed từ database hoặc tạo demo mới
2. Tạo OTP cho lần đăng nhập đầu tiên
3. Đăng nhập với username và OTP

### 6. Kiểm tra Database

Hệ thống sử dụng MongoDB collection `otp_users` với schema:
- username (unique)
- email (unique) 
- verifier (hash chain verifier)
- currentIndex (lần đăng nhập hiện tại)
- maxIndex (tổng số lần tối đa)
- isActive (trạng thái active)

### 7. Troubleshooting

#### Lỗi template không tìm thấy:
- Đã tạo layout template tại: `node/src/views/client/layouts/default.pug`

#### Lỗi port đã sử dụng:
- Sử dụng port khác: `$env:PORT=3001; node server.js`

#### Lỗi MongoDB connection:
- Kiểm tra MongoDB đang chạy
- Kiểm tra connection string trong config

### 8. Security Notes

⚠️ **Trong môi trường production:**
- Không trả về seed trong API response
- Sử dụng HTTPS
- Implement rate limiting
- Validate input nghiêm ngặt
- Log security events

✅ **Đã implement:**
- Hash chain algorithm đúng chuẩn
- One-time password security
- Forward security (server không biết seed)
- Replay attack protection