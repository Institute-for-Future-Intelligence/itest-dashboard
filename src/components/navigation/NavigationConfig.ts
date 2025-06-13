import type { usePermissions } from '../../hooks/usePermissions';

export interface NavigationItem {
  label: string;
  path: string;
  show: boolean;
  iconName: 'Home' | 'Water' | 'Cloud' | 'Sensors' | 'AdminPanelSettings';
  description: string;
}

export const getNavItemsForUser = (permissions: ReturnType<typeof usePermissions>): NavigationItem[] => {
  const baseItems = [
    { 
      label: 'Home', 
      path: '/home', 
      show: true, 
      iconName: 'Home' as const,
      description: 'Dashboard overview'
    },
    { 
      label: 'Weather', 
      path: '/weather', 
      show: permissions.hasPermission('canAccessWeatherData'),
      iconName: 'Cloud' as const,
      description: 'Weather data & analytics'
    },
    { 
      label: 'Sensors', 
      path: '/sensors', 
      show: permissions.hasPermission('canViewSensorData'),
      iconName: 'Sensors' as const,
      description: 'Sensor data management'
    },
    { 
      label: 'Water Quality', 
      path: '/water-quality', 
      show: permissions.hasPermission('canEnterWaterQuality'),
      iconName: 'Water' as const,
      description: 'Water quality measurements'
    },
    { 
      label: 'Admin', 
      path: '/admin', 
      show: permissions.isAdmin,
      iconName: 'AdminPanelSettings' as const,
      description: 'Administrative controls'
    },
  ];

  return baseItems.filter(item => item.show);
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin': return '#f44336';
    case 'educator': return '#2196f3';
    case 'student': return '#4caf50';
    default: return '#757575';
  }
}; 