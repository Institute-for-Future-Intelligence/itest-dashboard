import { useUserStore } from '../store/useUserStore';
import type { RolePermissions } from '../types';

export const usePermissions = () => {
  const { user, getUserPermissions, hasPermission } = useUserStore();

  // Safe permission checking with fallback
  const safeHasPermission = (permission: keyof RolePermissions) => {
    try {
      return hasPermission(permission);
    } catch {
      return false;
    }
  };

  return {
    user,
    permissions: getUserPermissions(),
    hasPermission: safeHasPermission,
    isAdmin: user?.role === 'admin',
    isEducator: user?.role === 'educator',
    isStudent: user?.role === 'student',
    // Convenience methods for common permission checks
    canManageUsers: safeHasPermission('canManageUsers'),
    canExportData: safeHasPermission('canExportData'),
    canViewAnalytics: safeHasPermission('canViewAnalytics'),
    canModifySettings: safeHasPermission('canModifySettings'),
    canViewSensorData: safeHasPermission('canViewSensorData'),
    canUploadSensorData: safeHasPermission('canUploadSensorData'),
  };
}; 