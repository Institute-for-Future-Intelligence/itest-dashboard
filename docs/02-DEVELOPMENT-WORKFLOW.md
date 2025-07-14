# 🔄 Development Workflow Guide

This guide outlines the development workflow for the Nā Puna ʻIke Dashboard project, including Git practices, pull request procedures, and deployment processes.

## 🌿 Branch Strategy

We use a **Feature Branch Workflow** with the following structure:

```
main (production)
├── feature/weather-improvements
├── feature/sensor-data-upload
├── bugfix/auth-redirect-issue
└── hotfix/critical-security-patch
```

### Branch Types:
- **`main`**: Production branch - always deployable
- **`feature/[description]`**: New features and enhancements
- **`bugfix/[description]`**: Bug fixes
- **`hotfix/[description]`**: Critical fixes that need immediate deployment

## 🚀 Development Process

### 1. Setting Up Your Development Environment

```bash
# Clone the repository
git clone https://github.com/institute-for-future-intelligence/itest-dashboard.git
cd itest-dashboard

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm run dev
```

### 2. Starting a New Feature

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/water-quality-dashboard

# Start coding!
```

### 3. Branch Naming Conventions

Use descriptive branch names with prefixes:

**✅ Good Examples:**
- `feature/water-quality-data-entry`
- `feature/admin-user-management`
- `bugfix/sensor-upload-validation`
- `hotfix/firebase-auth-timeout`

**❌ Bad Examples:**
- `feature1`
- `fix`
- `update`
- `john-changes`

## 💻 Development Best Practices

### Code Quality Standards

1. **TypeScript**: Always use proper typing
```typescript
// ✅ Good
interface WeatherData {
  temperature: number;
  humidity: number;
  location: string;
}

// ❌ Bad
const weatherData: any = {};
```

2. **Component Structure**: Use functional components with hooks
```typescript
// ✅ Good
const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  // ...
};

// ❌ Bad - Class components are not preferred
class WeatherCard extends React.Component {
  // ...
}
```

3. **State Management**: Use Zustand stores for global state
```typescript
// ✅ Good - Use existing stores
const { weatherData, fetchWeather } = useWeatherStore();

// ❌ Bad - Don't create local state for global data
const [weatherData, setWeatherData] = useState();
```

### Testing Requirements

Before pushing code:

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Check build
npm run build
```

### Commit Message Guidelines

Use the **Conventional Commits** format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix  
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(weather): add temperature trend visualization"
git commit -m "fix(auth): resolve login redirect loop issue"
git commit -m "docs: update onboarding guide with Firebase setup"
```

## 🔄 Pull Request Process

### 1. Preparing Your Pull Request

```bash
# Make sure your feature branch is up to date
git checkout feature/your-feature-name
git rebase main

# Push your branch
git push origin feature/your-feature-name
```

### 2. Creating the Pull Request

1. Go to GitHub and create a new Pull Request
2. Use the **Pull Request Template** (auto-populated)
3. Fill out all required sections:
   - **Description**: What does this PR do?
   - **Changes Made**: List of specific changes
   - **Testing**: How was this tested?
   - **Screenshots**: For UI changes
   - **Checklist**: Complete all items

### 3. Pull Request Requirements

Your PR must meet these criteria before approval:

**✅ Required Checks:**
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Code builds successfully
- [ ] PR description is complete
- [ ] Changes are reviewed and approved

**🔍 Review Process:**
1. **Automated checks** run via GitHub Actions
2. **Code review** by a senior team member
3. **Testing** of the feature/fix
4. **Approval** and merge

### 4. Addressing Review Comments

```bash
# Make requested changes
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature-name

# The PR will automatically update
```

## 🚢 Deployment Process

### Automatic Deployment

- **Main Branch**: Automatically deploys to GitHub Pages via GitHub Actions
- **Pull Requests**: Run automated checks but no preview deployment

### Manual Deployment (if needed)

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Common Development Tasks

### Working with Firebase

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules (when changed)
firebase deploy --only firestore:rules

# Deploy storage rules (when changed)
firebase deploy --only storage
```

### Database Migrations

When making Firestore schema changes:

1. Update the TypeScript interfaces in `src/types/`
2. Update any migration scripts
3. Test with development data first
4. Document the changes in your PR

### Adding New Dependencies

```bash
# Add production dependency
npm install package-name

# Add development dependency
npm install -D package-name

# Update package.json and commit
git add package.json package-lock.json
git commit -m "chore: add new dependency package-name"
```

## 🚨 Emergency Procedures

### Hotfix Process

For critical bugs in production:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# Make minimal changes to fix the issue
# Test thoroughly
# Create PR with "HOTFIX" label
# Get immediate review and approval
# Deploy ASAP
```

### Rolling Back Deployment

If a deployment causes issues:

```bash
# Find the last working commit
git log --oneline

# Create a revert commit
git revert <commit-hash>

# Push to main (this will trigger automatic deployment)
git push origin main
```

## 📋 Checklist for New Developers

Before making your first contribution:

- [ ] Read the [Getting Started Guide](01-GETTING-STARTED.md)
- [ ] Set up your development environment
- [ ] Run the project locally
- [ ] Understand the branch strategy
- [ ] Practice the Git workflow with a small change
- [ ] Get familiar with the PR template
- [ ] Know how to run tests and checks
- [ ] Understand the deployment process

## 🔧 Development Tools

### Recommended VSCode Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Git Hooks (Optional)

Set up pre-commit hooks to ensure code quality:

```bash
# Install husky for git hooks
npm install -D husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Firebase Issues:**
```bash
# Clear Firebase cache
firebase use --clear-cache
firebase login --reauth
```

**Git Issues:**
```bash
# Reset to clean state
git reset --hard origin/main
git clean -fd
```

## 📞 Getting Help

- **Immediate Help**: Ask your mentor or team lead
- **Technical Issues**: Create a GitHub issue with the `help-wanted` label
- **Process Questions**: Reference this guide or ask in team chat
- **Emergency**: Contact the project maintainer directly

Remember: It's better to ask for help than to struggle alone! 🤝 