/**
 * Chart grouping strategies for weather variables
 * Defines how variables should be grouped together in visualizations
 */

export interface VariableGroup {
  name: string;
  type: 'line' | 'bar' | 'area';
  variables: string[];
}

/**
 * Groups hourly weather variables into logical chart categories
 */
export const getHourlyVariableGroups = (selectedVariables: string[]): VariableGroup[] => {
  const groups: VariableGroup[] = [];

  // Temperature variables
  const tempVariables = selectedVariables.filter(v => 
    v.includes('temperature') || v === 'temperature_2m'
  );
  if (tempVariables.length > 0) {
    groups.push({
      name: 'Temperature Over Time',
      type: 'line',
      variables: tempVariables
    });
  }

  // Atmospheric conditions (humidity, pressure)
  const atmosphericVariables = selectedVariables.filter(v => 
    v.includes('humidity') || v.includes('pressure')
  );
  if (atmosphericVariables.length > 0) {
    groups.push({
      name: 'Atmospheric Conditions',
      type: 'line',
      variables: atmosphericVariables
    });
  }

  // Cloud coverage
  const cloudVariables = selectedVariables.filter(v => 
    v.includes('cloud_cover')
  );
  if (cloudVariables.length > 0) {
    groups.push({
      name: 'Cloud Cover Analysis',
      type: 'area',
      variables: cloudVariables
    });
  }

  // Wind conditions
  const windVariables = selectedVariables.filter(v => 
    v.includes('wind')
  );
  if (windVariables.length > 0) {
    groups.push({
      name: 'Wind Conditions',
      type: 'line',
      variables: windVariables
    });
  }

  // Solar radiation
  const radiationVariables = selectedVariables.filter(v => 
    v.includes('radiation')
  );
  if (radiationVariables.length > 0) {
    groups.push({
      name: 'Solar Radiation',
      type: 'area',
      variables: radiationVariables
    });
  }

  // Water cycle (precipitation, evapotranspiration)
  const waterVariables = selectedVariables.filter(v => 
    v.includes('precipitation') || v.includes('evapotranspiration')
  );
  if (waterVariables.length > 0) {
    groups.push({
      name: 'Water Cycle Variables',
      type: 'bar',
      variables: waterVariables
    });
  }

  return groups;
};

/**
 * Groups daily weather variables into logical chart categories
 */
export const getDailyVariableGroups = (selectedVariables: string[]): VariableGroup[] => {
  const groups: VariableGroup[] = [];

  // Temperature summary
  const tempVariables = selectedVariables.filter(v => 
    v.includes('temperature')
  );
  if (tempVariables.length > 0) {
    groups.push({
      name: 'Daily Temperature Summary',
      type: 'line',
      variables: tempVariables
    });
  }

  // Duration variables (daylight, sunshine)
  const durationVariables = selectedVariables.filter(v => 
    v.includes('duration')
  );
  if (durationVariables.length > 0) {
    groups.push({
      name: 'Daily Duration Analysis',
      type: 'bar',
      variables: durationVariables
    });
  }

  // Daily accumulations (precipitation, radiation)
  const accumulationVariables = selectedVariables.filter(v => 
    v.includes('precipitation') || v.includes('radiation')
  );
  if (accumulationVariables.length > 0) {
    groups.push({
      name: 'Daily Accumulations',
      type: 'bar',
      variables: accumulationVariables
    });
  }

  return groups;
}; 