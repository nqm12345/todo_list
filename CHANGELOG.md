# Changelog

Tất cả thay đổi quan trọng của dự án sẽ được ghi lại trong file này.

## [1.0.0] - 2025-10-18

### ✨ Added

#### Features
- **Authentication System**
  - User registration với validation
  - Login với JWT token
  - Password strength indicator
  - Remember me functionality
  - Auto-logout on token expiry
  - Protected routes

- **Task Management (CRUD)**
  - Create task với form đầy đủ
  - Read tasks từ MongoDB
  - Update task (edit form + toggle status)
  - Delete task với confirm dialog
  - Task fields: title, description, status, dueDate

- **Search & Filter**
  - Real-time search theo title/description
  - Filter by status (All, Pending, In-Progress, Completed)
  - Combined search + filter
  - Clear search button

- **Dashboard**
  - Statistics cards (Total, Pending, In-Progress, Completed)
  - Task list với status badges
  - Empty state
  - Loading states

#### UI/UX
- Hero images cho Login/Register pages
- Beautiful gradient backgrounds
- Hover effects và animations
- Toast notifications (success/error)
- Loading spinners
- Error boundary component
- Responsive design (Desktop/Tablet/Mobile)
- Skeleton loading states
- Password visibility toggle

#### Backend
- RESTful API với Express 5.1
- MongoDB integration với Mongoose
- JWT authentication middleware
- Password hashing với bcrypt
- CORS configuration
- Error handling middleware
- Input validation
- User data isolation

#### DevOps
- Environment variables setup
- Vercel deployment config
- Render deployment support
- MongoDB Atlas integration
- Production-ready CORS

### 📚 Documentation
- Comprehensive README.md
- Backend API documentation
- Frontend component documentation
- DEPLOYMENT.md guide
- TESTING.md guide
- VERIFICATION.md checklist
- Screenshots guide
- Code comments

### 🔒 Security
- Password hashing (bcrypt, 10 rounds)
- JWT token with 1h expiration
- Protected API routes
- User-specific data filtering
- XSS protection
- Input sanitization

### 🐛 Fixed
- Token persistence across page refreshes
- Auto-logout on 401 responses
- CORS issues với production URLs
- Form validation errors
- Mobile responsive issues
- Loading states không hiển thị

### 🎨 Improved
- CSS architecture (component-based)
- Error messages (Vietnamese)
- Toast notification styling
- Form input alignment
- Button hover effects
- Code organization

---

## [0.2.0] - 2025-10-15 (Development)

### Added
- Basic task CRUD
- Simple authentication
- MongoDB connection
- Basic UI components

### Changed
- Refactored AuthContext
- Updated API endpoints
- Improved error handling

---

## [0.1.0] - 2025-10-10 (Initial)

### Added
- Project scaffolding
- Basic Express server
- React + Vite setup
- Initial routing
- MongoDB schema design

---

## Release Notes

### Version 1.0.0 Highlights

**🎉 First Production Release**

This is the first stable release of Todo App, featuring:

- ✅ Complete authentication system
- ✅ Full CRUD operations for tasks
- ✅ Search and filter functionality
- ✅ Beautiful, responsive UI
- ✅ Production-ready deployment configs
- ✅ Comprehensive documentation

**Tech Stack:**
- Frontend: React 19.1.1 + Vite
- Backend: Node.js + Express 5.1
- Database: MongoDB 5.7 + Mongoose
- Auth: JWT + bcrypt

**Deployment:**
- Frontend: Vercel (recommended)
- Backend: Render/Railway
- Database: MongoDB Atlas

**What's Next (v1.1.0):**
- [ ] Task categories/tags
- [ ] Due date reminders
- [ ] Priority levels
- [ ] Drag & drop reordering
- [ ] Dark mode
- [ ] Export to PDF
- [ ] Multi-language support

---

## How to Use This Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

### Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

### Semantic Versioning
- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features (backward compatible)
- **PATCH** (x.x.1): Bug fixes

---

[1.0.0]: https://github.com/your-org/todo-app/releases/tag/v1.0.0
[0.2.0]: https://github.com/your-org/todo-app/releases/tag/v0.2.0
[0.1.0]: https://github.com/your-org/todo-app/releases/tag/v0.1.0
