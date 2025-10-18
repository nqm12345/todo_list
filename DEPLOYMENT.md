# 🚀 Hướng Dẫn Deploy Chi Tiết

## Deployment Checklist

### 📋 Pre-Deployment

- [ ] Code đã tested đầy đủ locally
- [ ] All console errors đã được fix
- [ ] Environment variables đã được chuẩn bị
- [ ] MongoDB Atlas đã setup (nếu dùng cloud)
- [ ] Git repository đã push lên GitHub

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Tạo MongoDB Atlas Account

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký account miễn phí
3. Tạo Organization mới

### Step 2: Tạo Cluster

1. Click **"Build a Database"**
2. Chọn **M0 Free Tier**
3. Chọn region gần nhất (Singapore cho VN)
4. Đặt tên cluster: `todo-app-cluster`
5. Click **"Create"**

### Step 3: Setup Database Access

1. Vào **Database Access** → **Add New Database User**
2. Authentication Method: **Password**
3. Username: `todo-admin`
4. Password: Tạo password mạnh (save lại)
5. Database User Privileges: **Read and write to any database**
6. Click **"Add User"**

### Step 4: Setup Network Access

1. Vào **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Chỉ dùng cho development/testing
   - Production: Thêm IP của Render/Railway
3. Click **"Confirm"**

### Step 5: Get Connection String

1. Vào **Database** → Click **"Connect"**
2. Chọn **"Connect your application"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy connection string:
   ```
   mongodb+srv://todo-admin:<password>@todo-app-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Thay `<password>` bằng password thực của user
7. Thay `?retryWrites` bằng `/todoapp?retryWrites` (thêm database name)

**Final connection string:**
```
mongodb+srv://todo-admin:YourPassword123@todo-app-cluster.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
```

---

## 🖥️ Backend Deployment (Render)

### Step 1: Chuẩn Bị Code

1. Đảm bảo `backend/package.json` có:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=16.x"
  }
}
```

2. Tạo file `.gitignore`:
```
node_modules/
.env
*.log
```

3. Push code lên GitHub

### Step 2: Create Web Service trên Render

1. Truy cập [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Select repo: `your-username/todo-app`

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `todo-app-backend`
- **Region:** Singapore
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings:**
- **Instance Type:** Free
- **Auto-Deploy:** Yes

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Thêm các biến:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGO_URI` | `mongodb+srv://todo-admin:...` (từ MongoDB Atlas) |
| `JWT_SECRET` | `your-super-secret-jwt-key-2025-prod` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (sẽ update sau) |

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Đợi deploy (2-5 phút)
3. Kiểm tra logs xem có lỗi không
4. Copy Backend URL: `https://todo-app-backend.onrender.com`

### Step 6: Test Backend

```bash
# Health check
curl https://todo-app-backend.onrender.com

# Test register
curl -X POST https://todo-app-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123!"}'
```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Chuẩn Bị Code

1. Update `frontend/.env`:
```env
VITE_API_BASE=https://todo-app-backend.onrender.com/api
```

2. Test locally:
```bash
cd frontend
npm run build
npm run preview
```

3. Nếu OK, push code lên GitHub

### Step 3: Deploy với Vercel CLI

```bash
cd frontend
vercel

# Trả lời các câu hỏi:
# Set up and deploy "frontend"? Y
# Which scope? [Your account]
# Link to existing project? N
# What's your project's name? todo-app-frontend
# In which directory is your code located? ./
# Want to override the settings? N
```

### Step 4: Add Environment Variables

**Cách 1: Vercel CLI**
```bash
vercel env add VITE_API_BASE production
# Nhập: https://todo-app-backend.onrender.com/api

vercel --prod
```

**Cách 2: Vercel Dashboard**
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `todo-app-frontend`
3. Settings → Environment Variables
4. Add:
   - **Key:** `VITE_API_BASE`
   - **Value:** `https://todo-app-backend.onrender.com/api`
   - **Environment:** Production
5. Redeploy từ Deployments tab

### Step 5: Update Backend CORS

1. Vào Render Dashboard → `todo-app-backend`
2. Environment → Edit `FRONTEND_URL`
3. Value: `https://todo-app-frontend.vercel.app`
4. Save → Auto redeploy

5. Hoặc update code `backend/server.js`:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://todo-app-frontend.vercel.app', // Your Vercel URL
  'http://localhost:5173'
];
```

6. Push lên GitHub → Render auto redeploy

### Step 6: Test Production

1. Truy cập Frontend URL: `https://todo-app-frontend.vercel.app`
2. Test flow:
   - Đăng ký tài khoản
   - Đăng nhập
   - Tạo task
   - Edit task
   - Delete task
3. Check DevTools Console (không có lỗi)
4. Check Network tab (API calls thành công)

---

## ✅ Post-Deployment Checklist

### Functional Testing

- [ ] Register hoạt động
- [ ] Login hoạt động
- [ ] Token saved và persist
- [ ] Create task thành công
- [ ] Read tasks từ DB
- [ ] Update task thành công
- [ ] Delete task thành công
- [ ] Search hoạt động
- [ ] Filter hoạt động
- [ ] Auto-logout on 401
- [ ] Toast notifications hiển thị
- [ ] Responsive trên mobile

### Performance

- [ ] Page load < 3s
- [ ] API response < 500ms
- [ ] No console errors
- [ ] No 404 assets

### Security

- [ ] HTTPS enabled (Vercel/Render auto)
- [ ] CORS configured correctly
- [ ] Environment variables not exposed
- [ ] JWT secret strong và unique

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Triệu chứng:**
```
Access to fetch at 'https://backend.com/api/tasks' from origin 'https://frontend.com' has been blocked by CORS policy
```

**Giải pháp:**
1. Check `FRONTEND_URL` trong backend env vars
2. Update `allowedOrigins` trong `server.js`
3. Redeploy backend

### Issue: 401 Unauthorized

**Triệu chứng:** Tất cả API calls trả về 401

**Giải pháp:**
1. Check `JWT_SECRET` giống nhau giữa dev và prod
2. Check token được lưu vào localStorage
3. Check Authorization header được gửi đi

### Issue: MongoDB Connection Timeout

**Triệu chứng:**
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
```

**Giải pháp:**
1. Check Network Access trên MongoDB Atlas
2. Add Render IP vào whitelist (hoặc 0.0.0.0/0)
3. Check connection string đúng format

### Issue: Vercel Build Failed

**Triệu chứng:** Build fails trên Vercel

**Giải pháp:**
1. Check `package.json` có đầy đủ dependencies
2. Run `npm run build` locally
3. Check build logs trên Vercel Dashboard

---

## 📊 Monitoring & Logs

### Render Logs

1. Render Dashboard → Select service
2. **Logs** tab → View real-time logs
3. Filter by error/warning

### Vercel Logs

1. Vercel Dashboard → Select project
2. **Deployments** → Click deployment
3. View build logs và runtime logs

### MongoDB Atlas Monitoring

1. Atlas Dashboard → **Monitoring** tab
2. View:
   - Operations per second
   - Connections
   - Network traffic

---

## 💰 Free Tier Limits

### Render Free Tier
- ✅ 750 hours/month
- ✅ Auto-sleep after 15min inactivity
- ⚠️ Cold start ~30s
- ✅ 100GB bandwidth/month

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

### MongoDB Atlas Free Tier (M0)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Enough cho demo/learning

---

## 🎓 Alternative Deployment Options

### Backend Alternatives

**Railway**
- Deploy: `railway up`
- Good UI, auto-detect frameworks
- Free $5 credit/month

**Heroku** (Paid after Nov 2022)
- Classic choice
- Easy deployment
- `git push heroku main`

**DigitalOcean App Platform**
- $5/month minimum
- Better performance than free tiers

### Frontend Alternatives

**Netlify**
- Similar to Vercel
- Drag & drop `dist/` folder
- Free tier generous

**GitHub Pages**
- Free for public repos
- Need config for SPA routing
- Domain: `username.github.io/repo`

**Cloudflare Pages**
- Unlimited bandwidth
- Fast global CDN
- Free tier

---

**Chúc bạn deploy thành công! 🚀**

Nếu gặp vấn đề, check logs đầu tiên. 90% lỗi là do env vars hoặc CORS.
