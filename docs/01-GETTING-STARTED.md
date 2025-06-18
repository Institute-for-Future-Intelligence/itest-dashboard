# 🚀 Onboarding Guide - iTEST Dashboard

Welcome to the iTEST Dashboard project! This guide will help you get up to speed with the codebase, understand the project structure, and start contributing effectively.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) and **npm** installed
- **Git** installed and configured
- **VSCode** (recommended) with these extensions:
  - TypeScript and React extensions
  - Prettier for code formatting
  - ESLint for code linting
- A **GitHub account** with access to this repository

## 🏗️ Project Overview

The iTEST Dashboard is a **React + TypeScript** web application that serves as a data visualization and management platform. It's deployed on **GitHub Pages** and uses **Firebase** for backend services (authentication, database, and file storage).

### Key Features:
- **Weather Data Page**: Real-time weather data from external APIs
- **Sensor Data Page**: Upload, view, and analyze sensor data
- **Water Quality Entry Page**: (Under development)
- **Admin Panel**: User management and system administration
- **Authentication**: Firebase-based user authentication

## 🗂️ Project Structure

```
itest-dashboard/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 auth/           # Authentication components
│   │   ├── 📁 layout/         # Layout components (headers, sidebars)
│   │   ├── 📁 navigation/     # Navigation components
│   │   ├── 📁 sensor/         # Sensor-specific components
│   │   ├── 📁 visualization/  # Charts and data visualization
│   │   └── 📁 weather/        # Weather-related components
│   ├── 📁 pages/              # Main page components
│   │   ├── HomePage.tsx       # Dashboard home page
│   │   ├── WeatherPage.tsx    # Weather data page
│   │   ├── SensorPage.tsx     # Sensor data page
│   │   └── WaterQualityPage.tsx # Water quality page (WIP)
│   ├── 📁 store/              # Zustand stores (state management)
│   │   ├── useAuthStore.ts    # Authentication state
│   │   ├── useWeatherStore.ts # Weather data state
│   │   └── useSensorStore.ts  # Sensor data state
│   ├── 📁 hooks/              # Custom React hooks
│   │   ├── useAuthState.ts    # Authentication logic
│   │   ├── useWeatherApi.ts   # Weather API integration
│   │   └── useSensorData.ts   # Sensor data logic
│   ├── 📁 utils/              # Utility functions
│   │   ├── excelProcessor.ts  # Excel file processing
│   │   ├── weatherConfig.ts   # Weather API configuration
│   │   └── 📁 chart/          # Chart utilities
│   ├── 📁 firebase/           # Firebase configuration
│   ├── 📁 types/              # TypeScript type definitions
│   └── 📁 theme/              # MUI theme configuration
├── 📁 public/                 # Static assets
├── 📁 .github/                # GitHub workflows and templates
└── 📄 Config files (package.json, vite.config.ts, etc.)
```

## 🛠️ Tech Stack Deep Dive

### Frontend Framework
- **React 19** with **TypeScript** for type safety
- **Vite** for fast development and building
- **React Router** for client-side routing

### State Management
- **Zustand** for global state management
  - Simple, lightweight alternative to Redux
  - Type-safe with TypeScript
  - No boilerplate code required

### UI & Styling
- **Material-UI (MUI)** for consistent design system
- **Emotion** for styled components
- **Recharts** for data visualization

### Backend Services
- **Firebase Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Authentication** for user management

### Hosting & Deployment
- **GitHub Pages** for static site hosting
- **GitHub Actions** for automated deployment

### Testing & Code Quality
- **Vitest** for unit testing
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## 🔧 Getting Started

### 1. Clone and Setup
```bash
git clone https://github.com/institute-for-future-intelligence/itest-dashboard.git
cd itest-dashboard
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 3. Start Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

## 🧠 Understanding the Codebase

### State Management with Zustand

Zustand stores are located in `src/store/`. Here's how they work:

```typescript
// Example: useAuthStore.ts
import { create } from 'zustand';

interface AuthStore {
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  isInitialized: false,
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
}));

// Usage in components:
const { isInitialized, setInitialized } = useAuthStore();
```

### Custom Hooks Pattern

Custom hooks encapsulate complex logic and make components cleaner:

```typescript
// hooks/useWeatherApi.ts
export const useWeatherApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchWeather = async (location: string) => {
    setLoading(true);
    // API call logic
    setLoading(false);
  };
  
  return { data, loading, fetchWeather };
};
```

### Component Organization

Components are organized by feature:
- **Atomic components**: Small, reusable pieces (buttons, inputs)
- **Feature components**: Specific to a feature (WeatherChart, SensorTable)
- **Page components**: Top-level route components

## 🔍 Common Development Tasks

### Adding a New Page
1. Create the page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation if needed

### Adding a New Feature
1. Create feature-specific components in `src/components/[feature]/`
2. Add any necessary state to Zustand stores
3. Create custom hooks for business logic
4. Add utility functions in `src/utils/`

### Working with Firebase
- **Firestore**: Database operations in `src/firebase/`
- **Authentication**: User login/logout handled by Firebase Auth
- **Storage**: File uploads for sensor data (Excel files, etc.)

**Note**: The app is hosted on GitHub Pages, not Firebase Hosting.

## 📚 Learning Resources

### React & TypeScript
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### State Management
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### UI Components
- [Material-UI Documentation](https://mui.com/)
- [Recharts Documentation](https://recharts.org/)

### Firebase
- [Firebase Documentation](https://firebase.google.com/docs)

## 🎯 Your First Tasks

As you get started, here are some beginner-friendly tasks:

1. **Explore the codebase**: Navigate through the folder structure
2. **Run the development server**: Get familiar with the local development setup
3. **Review existing components**: Look at how pages and components are structured
4. **Understand the data flow**: See how data moves from Firebase → Zustand → Components
5. **Try making a small change**: Update a text label or add a simple feature

## 🆘 Getting Help

- **Code Questions**: Ask your mentor or create a GitHub issue
- **Firebase Issues**: Check the Firebase console and logs
- **Build Issues**: Check the GitHub Actions tab for deployment logs
- **React/TypeScript**: Use the official documentation and community resources

## 📝 Next Steps

After completing this onboarding:
1. Read the [Development Workflow](02-DEVELOPMENT-WORKFLOW.md) guide
2. Review the [Architecture Documentation](03-ARCHITECTURE.md)
3. Set up your development environment
4. Start with your first assigned task!

Welcome to the team! 🎉 