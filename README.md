# 📊 Data Science Dashboard (iTEST Project)

This is the development repository for the **Data Science Dashboard** built as part of the **iTEST Grant Project**. The app is developed using **React + TypeScript + Vite**, with data stored and managed via **Firebase (Firestore & Storage)**.

---

## Project Overview

The dashboard allows users to:
- Query, visualize, and analyze weather and environmental data
- Integrate external data sources via API or CSV upload
- Store and manage project-specific information
- Display statistical summaries and generate insights

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Database & Storage:** Firebase (Firestore, Storage)
- **Deployment:** GitHub Pages
- **Styling:** MUI (Material UI), custom CSS
- **Data Visualization:** Recharts, Plotly

---

## 🚀 Getting Started

### 🔧 Clone the repository
   ```bash
   git clone https://github.com/institute-for-future-intelligence/itest-dashboard.git
   cd itest-dashboard
   ```

### 📦 Install Dependencies

```bash
npm install
```

---

### 🔐 Set Up Firebase Environment

Create a `.env` file in the root of your project with the following content:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

> Replace the `...` with your actual Firebase config values.

---

### ▶️ Run the Development Server

```bash
npm run dev
```

---

### 📌 Notes

- This app is still in active development.
- For questions, contributions, or access, contact [andriy@intofuture.org](mailto:andriy@intofuture.org).

## 📚 Documentation

For detailed documentation, please see the [`docs/`](docs/) folder:

- **New developers**: Start with the [Getting Started Guide](docs/01-GETTING-STARTED.md)
- **Development process**: See [Development Workflow](docs/02-DEVELOPMENT-WORKFLOW.md)
- **Technical details**: Check [Architecture Documentation](docs/03-ARCHITECTURE.md)
- **Repository setup**: Follow [Repository Setup Guide](docs/04-REPOSITORY-SETUP.md)
## Workflow Testing

*This section confirms our development workflow is properly set up.*
