// User & Authentication Types for Nā Puna ʻIke Dashboard

export interface User {
  uid: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'student' | 'educator';

// Role permissions - defines what each role can access
export interface RolePermissions {
  canViewDashboard: boolean;
  canEnterWaterQuality: boolean;
  canViewSensorData: boolean;
  canUploadSensorData: boolean;
  canAccessWeatherData: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canViewAnalytics: boolean;
  canModifySettings: boolean;
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canViewDashboard: true,
    canEnterWaterQuality: true,
    canViewSensorData: true,
    canUploadSensorData: true,
    canAccessWeatherData: true,
    canManageUsers: true,
    canExportData: true,
    canViewAnalytics: true,
    canModifySettings: true,
  },
  educator: {
    canViewDashboard: true,
    canEnterWaterQuality: true,
    canViewSensorData: true,
    canUploadSensorData: false,
    canAccessWeatherData: true,
    canManageUsers: false,
    canExportData: true,
    canViewAnalytics: true,
    canModifySettings: false,
  },
  student: {
    canViewDashboard: true,
    canEnterWaterQuality: true,
    canViewSensorData: true,
    canUploadSensorData: false,
    canAccessWeatherData: true,
    canManageUsers: false,
    canExportData: false,
    canViewAnalytics: false,
    canModifySettings: false,
  },
}; 