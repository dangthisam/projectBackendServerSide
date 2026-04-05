# Hướng dẫn Cấu hình CI/CD với GitHub Actions

## 📋 Tổng quan
CI/CD pipeline này tự động thực hiện các công việc sau:
- ✅ Kiểm tra cú pháp code (Lint)
- ✅ Chạy test (Test)
- ✅ Build Docker image
- ✅ Push Docker image lên Docker Hub
- ✅ Deploy tới server (tuỳ chọn)

## 🔧 Thiết lập ban đầu

### 1. Cấu hình Docker Hub
```bash
# Truy cập GitHub Repository
Settings → Secrets and variables → Actions
```

**Thêm Secrets sau:**

| Secret Name | Mô tả |
|---|---|
| `DOCKER_USERNAME` | Tên đăng nhập Docker Hub |
| `DOCKER_PASSWORD` | Token hoặc mật khẩu Docker Hub |

### 2. Cấu hình Deploy (tuỳ chọn)
Nếu bạn muốn tự động deploy tới server, thêm:

| Secret Name | Mô tả |
|---|---|
| `DEPLOY_KEY` | Private SSH key (paste nội dung file ~/.ssh/id_rsa) |
| `DEPLOY_HOST` | IP hoặc domain của server (vd: 192.168.1.100) |
| `DEPLOY_USER` | Username SSH (vd: root hoặc ubuntu) |

### 3. Tạo SSH Key (nếu chưa có)
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key
# Để public key vào ~/.ssh/authorized_keys trên server
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
```

## 📁 Cấu trúc workflow

### Workflow chính: `ci-cd.yml`

#### Job 1: Lint (Kiểm tra cú pháp)
- Chạy trên Node 16.x và 18.x
- Kiểm tra cú pháp code

#### Job 2: Build (Build & Test)
- Depends on: Lint
- Chạy test
- Build ứng dụng

#### Job 3: Docker Build
- Depends on: Build
- Chỉ chạy khi push vào branch `master`
- Build Docker image
- Push lên Docker Hub

#### Job 4: Deploy
- Depends on: Docker Build
- Chỉ chạy khi push vào branch `master`
- SSH vào server
- Pull Docker image mới
- Restart container

## 🚀 Cách sử dụng

### Workflow tự động kích hoạt khi:
1. **Push code** vào `master` hoặc `develop`
   - Chạy Lint → Build → Docker Build → Deploy
   
2. **Tạo Pull Request** vào `master` hoặc `develop`
   - Chỉ chạy Lint và Build (không build Docker)

### Kiểm tra trạng thái workflow:
- Truy cập: Repository → Actions
- Xem log chi tiết của mỗi job

## 🔒 Bảo mật

### ⚠️ Lưu ý quan trọng:
- **Không commit** file `.env` (đã được thêm vào `.gitignore`)
- **Không log** các secret trong console
- Sử dụng `secrets.` để truy cập sensitive data
- Thay đổi SSH key nếu bị rò rỉ

## 📝 Biến môi trường

Tạo file `.env` dựa trên `.env.example`:
```bash
cp .env.example .env
# Cấu hình các giá trị theo server của bạn
```

## 🐳 Docker Configuration

Dockerfile hiện tại:
- Base image: `node:16`
- Working directory: `/usr/src/app`
- Port: `3000`
- CMD: `node server.js`

### Cập nhật lên Node mới hơn (tuỳ chọn):
```dockerfile
FROM node:18-alpine  # Dùng Alpine để giảm kích thước image
```

## 📊 Monitoring & Debugging

### Xem log workflow:
```
GitHub Repository → Actions → Chọn workflow chạy → Xem chi tiết job
```

### Lỗi thường gặp:

1. **"Docker Hub authentication failed"**
   - Kiểm tra `DOCKER_USERNAME` và `DOCKER_PASSWORD` trong Secrets

2. **"SSH connection refused"**
   - Kiểm tra `DEPLOY_HOST`, `DEPLOY_USER` đúng không
   - Kiểm tra SSH key có quyền truy cập không

3. **"npm install failed"**
   - Kiểm tra `package.json` có lỗi
   - Kiểm tra kết nối internet

## ✨ Tùy chỉnh nâng cao

### Thêm code coverage:
```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

### Thêm notification Slack:
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Chạy trên schedule:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Chạy hàng ngày lúc 2h sáng
```

## 📚 Tài liệu tham khảo
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Node.js Setup Action](https://github.com/actions/setup-node)

## 💡 Bước tiếp theo

1. ✅ Commit và push workflow files
2. ✅ Cấu hình Docker Hub secrets
3. ✅ Test workflow bằng push code
4. ✅ (Tuỳ chọn) Cấu hình deploy secrets
5. ✅ Monitoring workflow runs

---
**Cần hỗ trợ?** Kiểm tra tab "Actions" trong GitHub repository để xem chi tiết lỗi.
