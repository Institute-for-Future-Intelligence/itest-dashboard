import { Box, Paper, Stack } from '@mui/material';
import VariableSelector from './VariableSelector';
import VisualizationContainer from '../visualization/VisualizationContainer';
import { HOURLY_VARIABLES, DAILY_VARIABLES } from '../../utils/weatherConfig';
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
      {/* Variable Selectors */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Hourly Variables - Left Side */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <VariableSelector
                title="Hourly Variables"
                variables={HOURLY_VARIABLES}
                selectedVariables={selectedHourlyVariables}
                onVariableChange={onHourlyVariablesChange}
              />
            </Paper>
          </Box>

          {/* Daily Variables - Right Side */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <VariableSelector
                title="Daily Variables"
                variables={DAILY_VARIABLES}
                selectedVariables={selectedDailyVariables}
                onVariableChange={onDailyVariablesChange}
              />
            </Paper>
          </Box>
        </Stack>
      </Box>

      {/* Visualization Area - Now naturally expanding */}
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