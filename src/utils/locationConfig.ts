// Site location configuration
// Updated with actual sensor site location information

export interface SiteLocation {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  website?: string;
  mapUrl?: string;
}

// Available sensor site locations
export const SENSOR_LOCATIONS: SiteLocation[] = [
  {
    id: 'waikalua_loko_ia',
    name: 'Waikalua Loko I\'a',
    description: 'Traditional Hawaiian fishpond in Kaneohe, Oahu',
    coordinates: {
      latitude: 21.4114287,
      longitude: -157.784269
    },
    website: 'https://www.thepaf.org/waikalua/',
    mapUrl: 'https://www.google.com/maps/place/Waikalua+Loko+Iʻa/@21.4114287,-157.7868439,17z/data=!3m1!4b1!4m6!3m5!1s0x7c006b87d089d785:0xfc119a53f2b75c55!8m2!3d21.4114287!4d-157.784269!16s%2Fg%2F11l2czg_0p?entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D'
  },
  // Additional locations can be added here as they become available
];

// Default location for new uploads
export const DEFAULT_LOCATION = SENSOR_LOCATIONS[0];

// Helper function to get location by ID
export const getLocationById = (id: string): SiteLocation | undefined => {
  return SENSOR_LOCATIONS.find(location => location.id === id);
};

// Helper function to get location display name
export const getLocationName = (id: string): string => {
  const location = getLocationById(id);
  return location?.name || id;
};

// Helper function to get location full details
export const getLocationDetails = (id: string): SiteLocation | null => {
  return getLocationById(id) || null;
}; 