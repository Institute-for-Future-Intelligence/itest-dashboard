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

// Water quality specific locations (including sensor locations + additional sites)
export const WATER_QUALITY_LOCATIONS: SiteLocation[] = [
  ...SENSOR_LOCATIONS, // Include existing sensor locations
  {
    id: 'anuenue_fisheries_research_center',
    name: 'Anuenue Fisheries Research Center (AFRC)',
    description: 'State aquaculture research facility',
    coordinates: {
      latitude: 21.3040736,
      longitude: -157.8711253
    },
    mapUrl: 'https://www.google.com/maps/place/Anuenue+Fisheries+Research+Center/@21.3656253,-157.8719733,13.23z/data=!4m6!3m5!1s0x7c006e119534b533:0xde401730b3340e84!8m2!3d21.3040736!4d-157.8711253!16s%2Fg%2F1v16qj3s?entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: 'windward_community_college',
    name: 'Windward Community College',
    description: 'Educational water monitoring site',
    coordinates: {
      latitude: 21.4080462,
      longitude: -157.8121212
    },
    mapUrl: 'https://www.google.com/maps/place/Windward+Community+College,+45-720+Keaahala+Rd,+Kaneohe,+HI+96744/@21.4080462,-157.8121212,17z'
  },
  {
    id: 'castle_high_school',
    name: 'James B. Castle High School',
    description: 'Educational water monitoring site',
    coordinates: {
      latitude: 21.404963,
      longitude: -157.7935282
    },
    mapUrl: 'https://www.google.com/maps/place/James+B.+Castle+High+School,+45-386+Kaneohe+Bay+Dr,+Kaneohe,+HI+96744/@21.404963,-157.7935282,17z'
  }
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