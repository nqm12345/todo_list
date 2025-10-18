# 🚀 Quick Deploy Checklist

Checklist nhanh để deploy production trong 1 giờ.

---

## ⏱️ Timeline: 60 phút

- **MongoDB Atlas:** 15 phút
- **Backend (Render):** 20 phút  
- **Frontend (Vercel):** 15 phút
- **Testing:** 10 phút

---

## 1️⃣ MongoDB Atlas (15 phút)

### Setup Account & Cluster

- [ ] Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Đăng ký/Đăng nhập
- [ ] Create **New Project** → Tên: `todo-app-project`
- [ ] Build a Database → **M0 FREE**
- [ ] Region: **Singapore** (gần VN nhất)
- [ ] Cluster Name: `todo-cluster`
- [ ] Create Cluster (đợi 1-3 phút)

### Database Access

- [ ] Sidebar → **Database Access** → Add New Database User
- [ ] Username: `todo-admin`
- [ ] Password: *Tạo password mạnh* → **SAVE LẠI**
- [ ] Privileges: **Read and write to any database**
- [ ] Add User

### Network Access

- [ ] Sidebar → **Network Access** → Add IP Address
- [ ] **Allow Access from Anywhere** (0.0.0.0/0)
- [ ] ⚠️ Chỉ dùng cho development
- [ ] Confirm

### Get Connection String

- [ ] Sidebar → **Database** → Connect
- [ ] **Connect your application**
- [ ] Driver: Node.js, Version: 4.1+
- [ ] Copy connection string:
  ```
  mongodb+srv://todo-admin:<password>@todo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- [ ] Thay `<password>` bằng password thực
- [ ] Thêm `/todoapp` trước `?retryWrites`:
  ```
  mongodb+srv://todo-admin:YourPass123@todo-cluster.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
  ```
- [ ] **COPY VÀ LƯU LẠI** (cần cho backend)

✅ MongoDB Ready!

---

## 2️⃣ Backend Deploy (Render) - 20 phút

### Prepare Code

- [ ] Đảm bảo code đã push lên GitHub
- [ ] Check `backend/package.json` có:
  ```json
  "scripts": {
    "start": "node server.js"
  }
  ```

### Create Web Service

- [ ] Truy cập [Render Dashboard](https://dashboard.render.com/)
- [ ] New + → **Web Service**
- [ ] Connect GitHub repository
- [ ] Select repo: `your-username/todo-app`
- [ ] Click repo → **Connect**

### Configure Service

**Settings Tab:**
- [ ] Name: `todo-app-backend`
- [ ] Region: **Singapore**
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: **Node**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: **Free**

**Environment Variables:**

Click **Advanced** → Add Environment Variable:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGO_URI` | *Paste MongoDB connection string* |
| `JWT_SECRET` | `your-super-secret-jwt-key-prod-2025` |
| `FRONTEND_URL` | *Leave blank (update sau)* |

- [ ] Add all 5 env vars
- [ ] Click **Create Web Service**

### Deploy & Test

- [ ] Đợi deploy (2-5 phút)
- [ ] Check **Logs** tab - không có errors
- [ ] Copy URL: `https://todo-app-backend.onrender.com`
- [ ] Test health:
  ```bash
  curl https://todo-app-backend.onrender.com
  ```
- [ ] **SAVE BACKEND URL**

✅ Backend Deployed!

---

## 3️⃣ Frontend Deploy (Vercel) - 15 phút

### Install Vercel CLI

```bash
npm install -g vercel
```

### Prepare Frontend

- [ ] Update `frontend/.env.example`:
  ```env
  VITE_API_BASE=https://todo-app-backend.onrender.com/api
  ```
- [ ] Test build locally:
  ```bash
  cd frontend
  npm run build
  ```
- [ ] Nếu OK, proceed

### Deploy with CLI

```bash
cd frontend
vercel
```

**Trả lời prompts:**
```
? Set up and deploy "frontend"? [Y/n] Y
? Which scope? [Your account]
? Link to existing project? [y/N] N
? What's your project's name? todo-app-frontend
? In which directory is your code located? ./
? Want to modify settings? [y/N] N
```

- [ ] Đợi deploy (1-2 phút)
- [ ] Copy Preview URL (sẽ deploy production sau)

### Add Environment Variables

**Option 1: CLI**
```bash
vercel env add VITE_API_BASE production
# Nhập: https://todo-app-backend.onrender.com/api

vercel --prod
```

**Option 2: Dashboard**
- [ ] Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Chọn project `todo-app-frontend`
- [ ] Settings → Environment Variables
- [ ] Add:
  - Key: `VITE_API_BASE`
  - Value: `https://todo-app-backend.onrender.com/api`
  - Environment: **Production, Preview, Development** (check all)
- [ ] Save
- [ ] Deployments tab → Redeploy latest

### Get Production URL

- [ ] Copy Production URL: `https://todo-app-frontend.vercel.app`
- [ ] **SAVE FRONTEND URL**

✅ Frontend Deployed!

---

## 4️⃣ Update Backend CORS (5 phút)

### Method 1: Render Dashboard

- [ ] Render Dashboard → `todo-app-backend`
- [ ] Environment → Edit `FRONTEND_URL`
- [ ] Value: `https://todo-app-frontend.vercel.app`
- [ ] Save Changes
- [ ] Auto redeploy (1-2 phút)

### Method 2: Update Code (Better)

- [ ] Edit `backend/server.js`:
  ```javascript
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://todo-app-frontend.vercel.app', // Add this
    'http://localhost:5173'
  ];
  ```
- [ ] Commit & push:
  ```bash
  git add backend/server.js
  git commit -m "fix: add Vercel URL to CORS origins"
  git push
  ```
- [ ] Render auto redeploy

✅ CORS Updated!

---

## 5️⃣ Final Testing (10 phút)

### Functional Tests

- [ ] Truy cập: `https://todo-app-frontend.vercel.app`
- [ ] **Register:**
  - Username: Test User
  - Email: test@example.com
  - Password: Test123!
- [ ] **Login:**
  - Email: test@example.com
  - Password: Test123!
- [ ] **Create Task:**
  - Title: Test Task
  - Description: Testing production
  - Status: Pending
  - Submit
- [ ] **Task appears in list?** ✅
- [ ] **Update Task:**
  - Click Edit
  - Change status to In-Progress
  - Submit
- [ ] **Status updated?** ✅
- [ ] **Delete Task:**
  - Click Delete
  - Confirm
- [ ] **Task removed?** ✅
- [ ] **Logout:**
  - Click Logout button
- [ ] **Redirected to login?** ✅

### DevTools Check

- [ ] Open DevTools (F12)
- [ ] **Console:** Không có errors (ngoài font warnings)
- [ ] **Network:**
  - API calls to `https://todo-app-backend.onrender.com`
  - Status 200/201 for successful requests
  - Authorization header có Bearer token
- [ ] **Application → Local Storage:**
  - Key `token` có value

### Mobile Test

- [ ] Toggle Device Toolbar (Ctrl+Shift+M)
- [ ] Test iPhone SE view
- [ ] Layout responsive? ✅

✅ All Tests Pass!

---

## 6️⃣ Update README (5 phút)

- [ ] Edit `README.md`:
  - Find `**[Xem Demo](https://your-app.vercel.app)**`
  - Replace với URL thực: `https://todo-app-frontend.vercel.app`
  - Find `Backend API: https://your-backend.onrender.com`
  - Replace với URL thực: `https://todo-app-backend.onrender.com`

- [ ] Commit & push:
  ```bash
  git add README.md
  git commit -m "docs: add production URLs"
  git push
  ```

✅ README Updated!

---

## 🎉 Deployment Complete!

### 🔗 Production URLs

- **Frontend:** `https://todo-app-frontend.vercel.app`
- **Backend:** `https://todo-app-backend.onrender.com`
- **Database:** MongoDB Atlas cluster

### 📝 Next Steps

1. ✅ Test toàn bộ features
2. ✅ Share URLs với team
3. ✅ Chụp screenshots từ production
4. ✅ Update slide với live demo link
5. ✅ Celebrate! 🎊

---

## 🐛 Troubleshooting

### Issue: Frontend không kết nối được Backend

**Check:**
- [ ] `VITE_API_BASE` env var đúng?
- [ ] Backend CORS có frontend URL?
- [ ] Backend đang online? (không sleep)

**Fix:**
- Redeploy frontend với đúng env var
- Update backend CORS origins
- Ping backend URL để wake up (Render free tier sleep sau 15min)

### Issue: 401 Unauthorized trên mọi requests

**Check:**
- [ ] JWT_SECRET giống nhau giữa dev và prod?
- [ ] Token được lưu vào localStorage?

**Fix:**
- Logout → Login lại
- Check DevTools → Application → Clear Storage

### Issue: MongoDB Connection Error

**Check:**
- [ ] MONGO_URI đúng format?
- [ ] Password có ký tự đặc biệt? (encode nó)
- [ ] Network Access whitelist: 0.0.0.0/0?

**Fix:**
- Update MONGO_URI trong Render env vars
- URL encode password: `@` → `%40`, `#` → `%23`

---

## 💡 Tips

- **Render Free Tier:** Backend sleep sau 15min inactive → First request slow (30s cold start)
- **Vercel:** Frontend deploy instant, không sleep
- **MongoDB Atlas:** M0 tier đủ cho demo/learning
- **HTTPS:** Tự động enable trên Vercel và Render
- **Logs:** Check Render Logs tab nếu có lỗi

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] CORS configured correctly
- [ ] All environment variables set
- [ ] Functional tests pass
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] README updated with live URLs
- [ ] Team notified

---

**Time Spent:** ~60 phút  
**Status:** 🚀 **PRODUCTION READY**

**Congratulations! Your app is live! 🎉**
