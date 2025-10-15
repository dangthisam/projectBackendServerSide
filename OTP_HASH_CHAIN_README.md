# Hash Chain OTP Authentication System

Hệ thống xác thực OTP sử dụng thuật toán Hash Chain (Lamport's One-Time Password) được triển khai hoàn chỉnh với Node.js, Express và MongoDB.

## 🔐 Thuật Toán Hash Chain OTP

### Giai đoạn khởi tạo (Initialization)
1. **Claimant** chọn một giá trị mầm bí mật `s` (seed) - 256 bits ngẫu nhiên
2. **Claimant** áp dụng hàm băm SHA-256 một chiều `f` nhiều lần:
   ```
   f(s) → f(f(s)) → f(f(f(s))) → ... → f^n(s)
   ```
3. **Claimant** gửi `f^n(s)` (gọi là verifier) đến server để đăng ký
4. **Server** lưu verifier, không biết seed `s`

### Giai đoạn đăng nhập (Authentication)
1. **Server** đang lưu `verifier = f^n(s)`
2. **Claimant** tính OTP cho lần thứ i: `OTP_i = f^(n-i)(s)`
3. **Claimant** gửi `OTP_i` cho server
4. **Server** kiểm tra: `f(OTP_i) === verifier_current`?
5. Nếu đúng → ✅ Login thành công, cập nhật `verifier = OTP_i`
6. Lần sau, claimant gửi `OTP_{i+1} = f^(n-i-1)(s)`

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình MongoDB
Đảm bảo MongoDB đang chạy và cập nhật connection string trong config.

### 3. Chạy server
```bash
npm run dev
```

### 4. Truy cập ứng dụng
- Đăng ký: `http://localhost:4000/otp-auth/register`
- Đăng nhập: `http://localhost:4000/otp-auth/login`
- Profile: `http://localhost:4000/otp-auth/profile`

## 🛠️ Công cụ CLI

### 1. Demo thuật toán
```bash
node node/src/tools/otpHashChainTester.js 1
```

### 2. Test tính đúng đắn
```bash
node node/src/tools/otpHashChainTester.js 2
```

### 3. Benchmark hiệu suất
```bash
node node/src/tools/otpHashChainTester.js 3
```

### 4. Tạo OTP từ seed
```bash
# Tạo demo với seed ngẫu nhiên
node node/src/tools/otpGenerator.js --demo

# Tạo OTP cụ thể
node node/src/tools/otpGenerator.js <seed> <maxIterations> <currentIteration>

# Ví dụ: Tạo OTP cho lần đăng nhập đầu tiên
node node/src/tools/otpGenerator.js abc123def456 100 1
```

## 📡 API Endpoints

### POST /otp-auth/register
Đăng ký tài khoản mới với Hash Chain OTP
```json
{
  "username": "testuser",
  "email": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "userId": "...",
    "username": "testuser",
    "seed": "...",
    "maxIterations": 100,
    "otpSequence": [...]
  }
}
```

### POST /otp-auth/login
Đăng nhập bằng OTP
```json
{
  "username": "testuser",
  "otp": "e4673c0ce363bfc1eec6b2626ffa33e59b0abd1cec4bf39808470ceb738300fd"
}
```

### GET /otp-auth/demo/:username
Lấy demo OTP sequence cho user (chỉ để test)

## 🔒 Tính chất bảo mật

✅ **Forward Security**: Server không bao giờ biết seed bí mật  
✅ **One-time Use**: Mỗi OTP chỉ sử dụng được 1 lần  
✅ **Non-reversible**: Không thể tính ngược từ OTP về seed  
✅ **Unpredictable**: Không thể đoán OTP tiếp theo từ OTP hiện tại  
✅ **Replay Attack Resistant**: Kẻ tấn công nghe lén OTP cũ không thể đăng nhập  

## 📊 Ví dụ thực tế

### Bước 1: Đăng ký
```bash
curl -X POST http://localhost:4000/otp-auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com"}'
```

### Bước 2: Lưu seed và tạo OTP
```bash
# Từ response, lưu seed và tạo OTP cho lần đăng nhập đầu tiên
node node/src/tools/otpGenerator.js <seed_from_response> 100 1
```

### Bước 3: Đăng nhập
```bash
curl -X POST http://localhost:4000/otp-auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","otp":"<otp_from_step2>"}'
```

### Bước 4: Đăng nhập lần tiếp theo
```bash
# Tạo OTP cho lần thứ 2
node node/src/tools/otpGenerator.js <seed> 100 2

# Đăng nhập với OTP mới
curl -X POST http://localhost:4000/otp-auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","otp":"<new_otp>"}'
```

## 🏗️ Cấu trúc dự án

```
node/src/
├── models/
│   └── otpUser.js              # MongoDB model cho OTP users
├── services/
│   └── hashChainService.js     # Core hash chain algorithms
├── controllers/client/
│   └── otpAuthController.js    # Authentication controllers
├── routes/client/
│   └── otpAuth.router.js       # OTP auth routes
├── views/client/pages/otp-auth/
│   ├── register.pug            # Registration page
│   ├── login.pug               # Login page
│   └── profile.pug             # User profile page
└── tools/
    ├── otpHashChainTester.js   # Algorithm demo & testing
    └── otpGenerator.js         # CLI OTP generator
```

## ⚠️ Lưu ý quan trọng

1. **Bảo mật seed**: Trong thực tế, không bao giờ trả về seed trong API response
2. **Lưu trữ an toàn**: Client phải lưu trữ seed một cách bảo mật
3. **Giới hạn số lần**: Khi hết OTP, user phải đăng ký lại với seed mới
4. **Đồng bộ hóa**: Client và server phải đồng bộ về số lần đăng nhập hiện tại

## 🧪 Testing

Chạy tất cả tests:
```bash
node node/src/tools/otpHashChainTester.js 4
```

## 📚 Tài liệu tham khảo

- [Lamport's One-Time Password](https://en.wikipedia.org/wiki/Lamport_signature)
- [RFC 2289 - A One-Time Password System](https://tools.ietf.org/html/rfc2289)
- [Hash Chain Authentication](https://en.wikipedia.org/wiki/Hash_chain)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License