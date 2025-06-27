import { Box } from '@mui/material';
import WeatherVariableTabs from './WeatherVariableTabs';
import VisualizationContainer from '../visualization/VisualizationContainer';
import type { VisualizationSection } from '../../types/chart';

interface WeatherContentProps {
  selectedHourlyVariables: string[];
  selectedDailyVariables: string[];
  visualizationSections: VisualizationSection[];
  hasData: boolean;
  onHourlyVariablesChange: (variables: string[]) => void;
  onDailyVariablesChange: (variables: string[]) => void;
}

const WeatherContent = ({
  selectedHourlyVariables,
  selectedDailyVariables,
  visualizationSections,
  hasData,
  onHourlyVariablesChange,
  onDailyVariablesChange,
}: WeatherContentProps) => {
  return (
    <Box>
      {/* Variable Selector with Tabs */}
      <WeatherVariableTabs
        selectedHourlyVariables={selectedHourlyVariables}
        selectedDailyVariables={selectedDailyVariables}
        onHourlyVariablesChange={onHourlyVariablesChange}
        onDailyVariablesChange={onDailyVariablesChange}
      />

      {/* Visualization Area */}
      <Box>
        <VisualizationContainer
          sections={visualizationSections}
          hasData={hasData}
        />
      </Box>
    </Box>
  );
};

export default WeatherContent; 