# 📚 Documentation - Nā Puna ʻIke Dashboard

This folder contains all project documentation for the Nā Puna ʻIke Dashboard.

## 📋 Documentation Index

### For New Team Members
- **[🚀 Getting Started Guide](01-GETTING-STARTED.md)** - Start here! Complete guide for new developers
- **[🔄 Development Workflow](02-DEVELOPMENT-WORKFLOW.md)** - Git workflow, PR process, and best practices

### Technical Documentation
- **[🏗️ Architecture Documentation](03-ARCHITECTURE.md)** - Technical architecture, data flow, and design decisions
- **[🛠️ Repository Setup Guide](04-REPOSITORY-SETUP.md)** - Repository configuration and maintenance

## 🎯 Quick Navigation

**I'm new to the project** → Start with [Getting Started Guide](01-GETTING-STARTED.md)

**I need to make changes** → Read [Development Workflow](02-DEVELOPMENT-WORKFLOW.md)

**I want to understand the system** → Check [Architecture Documentation](03-ARCHITECTURE.md)

**I'm setting up the repository** → Follow [Repository Setup Guide](04-REPOSITORY-SETUP.md)

**I'm an educator adding limu data** → On the live dashboard open **Observations** and use **Excel template** (download). In the repo the file lives at [public/templates/seaweed-observations-import-template.xlsx](../public/templates/seaweed-observations-import-template.xlsx). Fill the `Observations` sheet; read `How_to_use` and `Allowed_codes` in the workbook. After changing species/location codes in `src/types/observation.ts`, developers regenerate with `npm run template:observations`. (Spreadsheet upload to Firestore is planned; until then use the form or email the filled file.)

## 📝 Keeping Documentation Updated

When you make changes to the codebase:

1. **Add new features** → Update Architecture Documentation
2. **Change development process** → Update Development Workflow
3. **Add new setup steps** → Update Getting Started Guide
4. **Modify repository settings** → Update Repository Setup Guide

Good documentation is key to effective collaboration! 🤝 