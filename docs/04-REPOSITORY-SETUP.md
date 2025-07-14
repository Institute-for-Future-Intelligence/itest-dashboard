# 📝 Repository Setup Guide

This guide covers the complete setup process for maintaining the Nā Puna ʻIke Dashboard repository, including branch protection, environment configuration, and team management.

## 🔒 Setting Up Branch Protection Rules

To enforce the pull request workflow and prevent direct pushes to main, follow these steps:

### 1. Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Select **Branches** from the left sidebar

### 2. Add Branch Protection Rule
1. Click **Add rule**
2. Set **Branch name pattern** to: `main`
3. Configure the following settings:

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (or more based on team size)
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (optional)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Select these required status checks:
    - `Quality Checks`
    - `Security Checks`  
    - `PR Requirements Check`
    - `All Checks Complete`

- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (recommended)
- ✅ **Include administrators** (applies rules to admins too)

#### Optional but Recommended:
- ✅ **Restrict pushes that create matching branches**
- ✅ **Allow force pushes** (unchecked)
- ✅ **Allow deletions** (unchecked)

### 3. Save the Rules
Click **Create** to apply the branch protection rules.

## 🔐 Environment Variables Setup

### For Repository Secrets (GitHub Actions)
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

### For Local Development
Create a `.env` file in the root directory with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Development Configuration
VITE_ENV=development
```

## 👥 Team Access Management

### Repository Permissions
Set up team permissions in **Settings** → **Manage access**:

- **Admin**: You (repository owner)
- **Write**: Senior developers who can review and merge PRs
- **Read**: Interns and junior developers (they can create PRs but not merge)

### Creating Teams (Organization Level)
If using GitHub Organization:
1. Go to your organization settings
2. Create teams: `Senior Developers`, `Junior Developers`, `Interns`
3. Assign appropriate repository permissions to each team

## 🔧 Required GitHub Actions Setup

The repository includes several workflows that require proper setup:

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)
- Automatically deploys to GitHub Pages when code is merged to main
- Requires Firebase environment variables as repository secrets

### 2. PR Checks Workflow (`.github/workflows/pr-checks.yml`)
- Runs on every pull request
- Performs quality checks, security audits, and requirement validation
- Must pass before PR can be merged

## 📋 Issue Templates Setup

Create issue templates to standardize bug reports and feature requests:

### 1. Navigate to Settings
Go to **Settings** → **Features** → **Issues** → **Set up templates**

### 2. Create Templates
Add templates for:
- Bug Report
- Feature Request
- Documentation Update
- Question/Help

## 🏷️ Labels Configuration

Set up consistent labels for issues and PRs:

```
Type Labels:
- bug (red)
- feature (green)
- documentation (blue)
- enhancement (purple)
- question (yellow)

Priority Labels:
- priority-high (red)
- priority-medium (orange)
- priority-low (green)

Status Labels:
- status-in-progress (yellow)
- status-needs-review (orange)
- status-blocked (red)
- status-ready (green)
```

## 🔍 Code Quality Tools

### ESLint Configuration
The project uses ESLint with TypeScript support. The configuration is in `eslint.config.js`.

### Prettier Configuration
Code formatting is handled by Prettier. Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### VSCode Settings
Create `.vscode/settings.json` for consistent editor settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🚀 Deployment Configuration

### GitHub Pages Setup
1. Go to **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. The deploy workflow will handle the rest

### Firebase Services Configuration
Your Firebase setup includes:
1. **Firestore**: Database for user data and app content
2. **Cloud Storage**: File uploads (sensor data, etc.)
3. **Authentication**: User management

**Note**: You use GitHub Pages for hosting, not Firebase Hosting.

## 📊 Monitoring and Analytics

### GitHub Insights
Monitor repository activity through:
- **Insights** → **Pulse**: Recent activity
- **Insights** → **Contributors**: Contribution statistics
- **Insights** → **Code frequency**: Code change patterns

### Dependencies Management
- Use **Dependabot** for automated dependency updates
- Configure in `.github/dependabot.yml`
- Set up security alerts for vulnerable dependencies

## 🔄 Maintenance Tasks

### Regular Maintenance
Schedule these tasks:

**Weekly:**
- Review open PRs and issues
- Check dependency updates
- Monitor deployment status

**Monthly:**
- Review and update documentation
- Clean up stale branches
- Audit team permissions

**Quarterly:**
- Security audit
- Performance review
- Architecture review

## 📝 Documentation Maintenance

Keep these files up to date:
- `README.md`: Project overview and quick start
- `docs/01-GETTING-STARTED.md`: New team member guide
- `docs/02-DEVELOPMENT-WORKFLOW.md`: Development process
- `docs/03-ARCHITECTURE.md`: Technical architecture
- `docs/04-REPOSITORY-SETUP.md`: This setup guide

## 🆘 Troubleshooting Common Issues

### Branch Protection Issues
**Problem**: Can't push to main branch
**Solution**: This is expected! Create a feature branch and PR instead

**Problem**: PR checks failing
**Solution**: Check the Actions tab for detailed error logs

### Environment Setup Issues
**Problem**: Build failing with missing environment variables
**Solution**: Ensure all required Firebase config is set in GitHub Secrets

**Problem**: Local development not working
**Solution**: Check `.env` file has all required variables

### Access Control Issues
**Problem**: Team member can't create PRs
**Solution**: Ensure they have at least "Read" access to the repository

**Problem**: PR can't be merged
**Solution**: Check if all required status checks are passing and approvals are in place

## 📞 Getting Help

If you encounter issues with repository setup:
1. Check GitHub's documentation on branch protection and Actions
2. Review the error messages in the Actions tab
3. Consult the team or create an issue with the "question" label

## ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly:

**Repository Settings:**
- [ ] Branch protection rules configured for `main`
- [ ] Required status checks enabled
- [ ] Team permissions set up correctly
- [ ] Repository secrets configured

**Workflows:**
- [ ] Deploy workflow tested and working
- [ ] PR checks workflow enabled
- [ ] All required GitHub Actions secrets added

**Documentation:**
- [ ] All documentation files created and up to date
- [ ] Issue templates configured
- [ ] Labels created and organized

**Team Setup:**
- [ ] Team members added with appropriate permissions
- [ ] Development workflow communicated to team
- [ ] First PR tested to verify the process works

**Quality Assurance:**
- [ ] Code quality tools configured
- [ ] Testing framework set up
- [ ] Security scanning enabled

Once all items are checked, your repository is ready for collaborative development! 🎉 