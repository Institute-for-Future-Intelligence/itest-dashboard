# 🏗️ Architecture Documentation

This document provides a comprehensive overview of the iTEST Dashboard architecture, including technical decisions, data flow patterns, and system design principles.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Services](#backend-services)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)
- [Deployment Architecture](#deployment-architecture)

## 🎯 System Overview

The iTEST Dashboard is a **Single Page Application (SPA)** built with modern web technologies, designed for data visualization and management in educational research contexts.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase      │    │   External      │
│   (React SPA)   │◄──►│   Services      │◄──►│   APIs          │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Authentication│    │ • Weather API   │
│ • TypeScript    │    │ • Firestore DB  │    │ • Other APIs    │
│ • Zustand       │    │ • Cloud Storage │    │                 │
│ • Material-UI   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              
         ▼                                              
┌─────────────────┐                                     
│  GitHub Pages   │                                     
│   (Hosting)     │                                     
└─────────────────┘                                     
```

### Core Principles

1. **Type Safety**: Full TypeScript implementation
2. **Component Isolation**: Modular, reusable components
3. **State Management**: Centralized with Zustand
4. **Performance**: Lazy loading and code splitting
5. **Security**: Firebase Authentication and rules
6. **Scalability**: Modular architecture for easy expansion

## 🖥️ Frontend Architecture

### Technology Stack

- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and development server
- **Material-UI**: Consistent design system
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Recharts**: Data visualization

### Project Structure

```
src/
├── 📁 components/          # Reusable UI components
│   ├── 📁 auth/           # Authentication components
│   ├── 📁 layout/         # Layout components
│   ├── 📁 navigation/     # Navigation components
│   ├── 📁 sensor/         # Sensor-specific components
│   ├── 📁 visualization/  # Chart and graph components
│   └── 📁 weather/        # Weather-related components
├── 📁 pages/              # Route-level page components
├── 📁 hooks/              # Custom React hooks
├── 📁 store/              # Zustand state stores
├── 📁 utils/              # Utility functions
├── 📁 types/              # TypeScript type definitions
├── 📁 firebase/           # Firebase configuration
└── 📁 theme/              # Material-UI theme
```

### Component Architecture

#### Atomic Design Principles

```
Pages (Organisms)
├── Templates
├── Organisms (Complex components)
├── Molecules (Component combinations)  
└── Atoms (Basic components)
```

**Example Component Hierarchy:**
```
SensorPage (Page)
├── SensorDataTable (Organism)
│   ├── DataTable (Molecule)
│   │   ├── TableHeader (Molecule)
│   │   └── TableRow (Molecule)
│   │       ├── TableCell (Atom)
│   │       └── ActionButton (Atom)
│   └── DataFilters (Molecule)
│       ├── DatePicker (Atom)
│       └── FilterSelect (Atom)
└── SensorUploadDialog (Organism)
    ├── FileUpload (Molecule)
    └── ProgressIndicator (Atom)
```

### Routing Architecture

```typescript
// App.tsx - Route Configuration
const routes = [
  { path: '/', component: LoginPage, public: true },
  { path: '/home', component: HomePage, private: true },
  { path: '/weather', component: WeatherPage, private: true },
  { path: '/sensors', component: SensorPage, private: true },
  { path: '/water-quality', component: WaterQualityPage, private: true },
  { path: '/admin', component: AdminPage, private: true, admin: true }
];
```

## 🗄️ Backend Services (Firebase)

### Firebase Services Used

1. **Authentication**: User management and security
2. **Firestore**: NoSQL document database
3. **Cloud Storage**: File uploads and storage
4. **Security Rules**: Data access control

**Note**: The application is hosted on **GitHub Pages**, not Firebase Hosting.

### Database Schema (Firestore)

```
/users/{userId}
├── email: string
├── role: 'admin' | 'user' | 'viewer'
├── createdAt: timestamp
└── lastLogin: timestamp

/sensorData/{docId}
├── userId: string
├── deviceId: string
├── timestamp: timestamp
├── temperature: number
├── humidity: number
├── location: {
│   ├── latitude: number
│   └── longitude: number
│ }
└── metadata: object

/weatherData/{docId}
├── location: string
├── timestamp: timestamp
├── temperature: number
├── humidity: number
├── pressure: number
└── conditions: string

/waterQuality/{docId}
├── sampleId: string
├── location: string
├── testDate: timestamp
├── pH: number
├── dissolved_oxygen: number
└── turbidity: number
```

### Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /sensorData/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // Admin-only collections
    match /users/{document} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🗂️ State Management

### Zustand Store Architecture

```typescript
// Store Structure
interface AppState {
  // Authentication
  auth: AuthState;
  
  // Data States
  weather: WeatherState;
  sensor: SensorState;
  waterQuality: WaterQualityState;
  
  // UI States
  theme: ThemeState;
  navigation: NavigationState;
}
```

### Store Pattern

```typescript
// Example: useSensorStore.ts
interface SensorStore {
  // State
  data: SensorData[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  
  // Actions
  fetchData: () => Promise<void>;
  uploadData: (file: File) => Promise<void>;
  setFilters: (filters: FilterState) => void;
  clearError: () => void;
}

export const useSensorStore = create<SensorStore>()((set, get) => ({
  // Initial state
  data: [],
  loading: false,
  error: null,
  filters: defaultFilters,
  
  // Actions
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await sensorService.fetchData(get().filters);
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // ... other actions
}));
```

### Custom Hooks Pattern

```typescript
// hooks/useSensorData.ts
export const useSensorData = () => {
  const { data, loading, error, fetchData } = useSensorStore();
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    sensorData: data,
    isLoading: loading,
    error,
    refetch: fetchData
  };
};
```

## 🔄 Data Flow

### Data Flow Architecture

```
External API ──► Custom Hook ──► Zustand Store ──► React Component
                     ▲                 │
                     │                 ▼
Firebase Service ◄───┴─────────────► Local State
```

### Typical Data Flow Example

```typescript
// 1. Component requests data
const WeatherPage = () => {
  const { weatherData, fetchWeather } = useWeatherApi();
  
  useEffect(() => {
    fetchWeather('Boston');
  }, []);
  
  return <WeatherChart data={weatherData} />;
};

// 2. Custom hook manages API calls
const useWeatherApi = () => {
  const { setWeatherData, setLoading } = useWeatherStore();
  
  const fetchWeather = async (location: string) => {
    setLoading(true);
    const data = await weatherService.getCurrentWeather(location);
    setWeatherData(data);
    setLoading(false);
  };
  
  return { fetchWeather };
};

// 3. Service handles external API
const weatherService = {
  getCurrentWeather: async (location: string) => {
    const response = await fetch(`/api/weather?location=${location}`);
    return response.json();
  }
};
```

### Error Handling Flow

```
API Error ──► Service Layer ──► Store (Error State) ──► Component (Error UI)
                     │
                     ▼
           Error Logging Service
```

## 🔒 Security Architecture

### Authentication Flow

```
User Login ──► Firebase Auth ──► Token Verification ──► Route Access
    │                                     │
    ▼                                     ▼
User State ──────────────────────► Protected Components
```

### Authorization Levels

1. **Public Routes**: Login, registration
2. **Authenticated Routes**: Dashboard, data views
3. **Admin Routes**: User management, system settings

### Data Security

- **Client-side**: Form validation, input sanitization
- **Transport**: HTTPS encryption, secure API calls
- **Server-side**: Firebase Security Rules, token validation
- **Storage**: Encrypted at rest (Firebase default)

## ⚡ Performance Considerations

### Code Splitting Strategy

```typescript
// Lazy loading pages
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const SensorPage = lazy(() => import('./pages/SensorPage'));

// Route-based splitting
<Routes>
  <Route path="/weather" element={
    <Suspense fallback={<Loading />}>
      <WeatherPage />
    </Suspense>
  } />
</Routes>
```

### Data Optimization

1. **Pagination**: Large datasets split into pages
2. **Virtualization**: Virtual scrolling for tables
3. **Caching**: Firebase offline persistence
4. **Debouncing**: Search and filter operations

### Bundle Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts'],
          firebase: ['firebase/app', 'firebase/firestore']
        }
      }
    }
  }
});
```

## 🚀 Deployment Architecture

### Build Process

```
Source Code ──► TypeScript Compilation ──► Vite Build ──► Static Assets
     │                                                        │
     ▼                                                        ▼
ESLint/Prettier ──► Testing ──► Bundle Analysis ──► GitHub Pages
```

### CI/CD Pipeline

```yaml
# GitHub Actions Workflow
Trigger (PR/Push) ──► Install Dependencies ──► Type Check ──► Lint ──► Test ──► Build ──► Deploy
                                                                                      │
                                                                                      ▼
                                                                              GitHub Pages
```

### Environment Configuration

```
Development ──► Local Vite Server + Firebase Services
Production ──► GitHub Pages + Firebase Services
```

## 📊 Monitoring and Analytics

### Performance Monitoring

- **Core Web Vitals**: Lighthouse CI integration
- **Bundle Analysis**: Bundle size tracking
- **Error Tracking**: Console error monitoring

### User Analytics

- **Firebase Analytics**: User behavior tracking
- **GitHub Insights**: Repository activity
- **Usage Metrics**: Feature adoption rates

## 🔮 Future Architecture Considerations

### Planned Enhancements

1. **Microservices**: Breaking down into smaller services
2. **PWA Features**: Offline capability, push notifications
3. **Real-time Updates**: WebSocket connections for live data
4. **Advanced Caching**: Redis for session management
5. **API Gateway**: Centralized API management

### Scalability Planning

- **Database Sharding**: Firestore collection partitioning
- **CDN Integration**: Global content delivery
- **Load Balancing**: Multi-region deployment
- **Caching Strategy**: Multi-layer caching implementation

## 📚 Technical Decisions

### Why These Technologies?

| Technology | Reason | Alternative Considered |
|------------|--------|----------------------|
| React 19 | Latest features, concurrent rendering | Vue.js, Angular |
| TypeScript | Type safety, better DX | Plain JavaScript |
| Zustand | Lightweight, simple API | Redux, Context API |
| Firebase | Rapid development, managed services | Custom backend |
| Material-UI | Consistent design, accessibility | Tailwind CSS, Chakra UI |
| Vite | Fast builds, modern tooling | Create React App, Webpack |

### Trade-offs Made

1. **Firebase vs Custom Backend**: Chose rapid development over full control
2. **Material-UI vs Custom Design**: Chose consistency over unique branding
3. **Client-side vs Server-side Rendering**: Chose simplicity over SEO optimization

## 🔧 Development Guidelines

### Code Organization Principles

1. **Feature-based Structure**: Group by functionality, not file type
2. **Dependency Injection**: Loose coupling between components
3. **Single Responsibility**: Each file has one clear purpose
4. **DRY Principle**: Reusable utilities and components

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: Descriptive verbs (fetchData, handleSubmit)
- **Variables**: Descriptive nouns (userData, isLoading)
- **Constants**: UPPER_SNAKE_CASE

This architecture documentation should be updated as the system evolves and new features are added. 