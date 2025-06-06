import { useUserStore } from '../store/useUserStore';

export const usePermissions = () => {
  const { user, getUserPermissions, hasPermission } = useUserStore();

  // Safe permission checking with fallback
  const safeHasPermission = (permission: string) => {
    try {
      return hasPermission(permission as any);
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
    canUploadSensorData: safeHasPermission('canUploadSensorData'),
  };
}; 