# 🤝 Contributing to Todo App

Thank you for considering contributing to Todo App! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.x
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/todo-app.git
   cd todo-app
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-org/todo-app.git
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Setup environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your values
   
   # Frontend (optional)
   cd ../frontend
   cp .env.example .env
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

---

## 🔄 Development Workflow

### Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

**Examples:**
- `feature/add-task-categories`
- `fix/login-redirect-issue`
- `docs/update-api-documentation`

### Make Changes

1. Write your code
2. Test your changes
3. Run linter: `npm run lint` (if available)
4. Commit your changes

### Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

---

## 💻 Coding Standards

### JavaScript/React

- Use **ES6+** syntax
- Use **functional components** with hooks
- Use **async/await** instead of promises chains
- Use **const/let**, not var
- Name components in **PascalCase**
- Name functions in **camelCase**
- Use **descriptive variable names**

**Example:**
```javascript
// ✅ Good
const handleTaskCreate = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    toast.success('Task created successfully!');
  } catch (error) {
    toast.error('Failed to create task');
  }
};

// ❌ Bad
const f = (d) => {
  api.post('/tasks', d).then(r => alert('ok')).catch(e => alert('err'));
};
```

### CSS

- Use **component-based CSS files**
- Name classes in **kebab-case**
- Prefer **CSS classes** over inline styles
- Make responsive with **media queries**

**Example:**
```css
/* ✅ Good */
.task-card {
  padding: 1rem;
  border-radius: 8px;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* ❌ Bad */
.TaskCard { padding: 10px; }
```

### Backend

- Use **async/await** for database operations
- Use **try-catch** for error handling
- Use **meaningful error messages** (Vietnamese)
- Validate input at controller level

---

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```bash
# Feature
git commit -m "feat(tasks): add search functionality"

# Bug fix
git commit -m "fix(auth): resolve token expiry redirect issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple lines
git commit -m "feat(tasks): add task categories

- Add category model
- Update task schema
- Add category filter UI
- Update API endpoints

Closes #42"
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code compiles without errors
- [ ] All tests pass (if any)
- [ ] No console errors
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Tested on Chrome, Firefox, Safari (if UI changes)
- [ ] Tested on mobile (if UI changes)

### Submit Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

2. **Create PR on GitHub**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template

3. **PR Title Format**
   ```
   feat(tasks): add search functionality
   ```

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [x] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - Tested on Chrome/Firefox
   - Tested on mobile
   - All manual tests pass
   
   ## Screenshots
   (if applicable)
   
   ## Related Issues
   Closes #42
   ```

### Review Process

1. **Automated checks** will run (if configured)
2. **Maintainers** will review your code
3. **Respond to feedback** by making changes
4. Once approved, maintainers will **merge** your PR

---

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Check if bug still exists in latest version
- Try to reproduce on a clean install

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

---

## 💡 Feature Requests

### Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, etc.
```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

## 🙏 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in CHANGELOG.md

---

## 📞 Questions?

- Open a [GitHub Discussion](https://github.com/your-org/todo-app/discussions)
- Email: minh@example.com or khai@example.com

---

**Thank you for contributing! 🎉**
