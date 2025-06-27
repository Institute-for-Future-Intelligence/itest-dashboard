import type { WeatherVariable } from '../../types/weather';

// Define category display order and labels as constants
export const WEATHER_CATEGORY_ORDER = [
  'temperature', 
  'humidity', 
  'pressure', 
  'wind', 
  'precipitation', 
  'radiation', 
  'other'
] as const;

export const WEATHER_CATEGORY_LABELS = {
  temperature: 'Temperature',
  humidity: 'Humidity & Atmospheric',
  pressure: 'Pressure',
  wind: 'Wind Conditions',
  precipitation: 'Precipitation & Water',
  radiation: 'Solar Radiation',
  other: 'Other Variables'
} as const;

export type WeatherCategory = keyof typeof WEATHER_CATEGORY_LABELS;

// Grouped variables interface
export interface GroupedWeatherVariables {
  [category: string]: WeatherVariable[];
}

// Category info interface
export interface CategoryInfo {
  id: WeatherCategory;
  label: string;
  variables: WeatherVariable[];
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  someSelected: boolean;
}

/**
 * Groups weather variables by their category
 * Pure function - no side effects, easy to test
 */
export const groupWeatherVariablesByCategory = (
  variables: WeatherVariable[]
): GroupedWeatherVariables => {
  return variables.reduce((acc, variable) => {
    const category = variable.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(variable);
    return acc;
  }, {} as GroupedWeatherVariables);
};

/**
 * Gets ordered category information with selection state
 * Combines grouping logic with selection state calculation
 */
export const getOrderedCategoriesWithState = (
  variables: WeatherVariable[],
  selectedVariables: string[]
): CategoryInfo[] => {
  const grouped = groupWeatherVariablesByCategory(variables);
  
  return WEATHER_CATEGORY_ORDER
    .map((categoryId) => {
      const categoryVariables = grouped[categoryId] || [];
      if (categoryVariables.length === 0) return null;

      const selectedInCategory = categoryVariables.filter(v => 
        selectedVariables.includes(v.apiParam)
      );

      return {
        id: categoryId,
        label: WEATHER_CATEGORY_LABELS[categoryId],
        variables: categoryVariables,
        selectedCount: selectedInCategory.length,
        totalCount: categoryVariables.length,
        allSelected: selectedInCategory.length === categoryVariables.length,
        someSelected: selectedInCategory.length > 0,
      };
    })
    .filter((category): category is NonNullable<typeof category> => category !== null);
};

/**
 * Calculates what variables should be selected when toggling a category
 * Returns the new selection array
 */
export const calculateCategoryToggleSelection = (
  currentSelection: string[],
  categoryVariables: WeatherVariable[],
  allCurrentlySelected: boolean
): string[] => {
  const categoryVariableIds = categoryVariables.map(v => v.apiParam);
  
  if (allCurrentlySelected) {
    // Deselect all in this category
    return currentSelection.filter(id => !categoryVariableIds.includes(id));
  } else {
    // Select all in this category
    const newSelection = [...currentSelection];
    categoryVariableIds.forEach(id => {
      if (!newSelection.includes(id)) {
        newSelection.push(id);
      }
    });
    return newSelection;
  }
};

/**
 * Utility to get all variable IDs from a variables array
 */
export const extractVariableIds = (variables: WeatherVariable[]): string[] => {
  return variables.map(v => v.apiParam);
}; 