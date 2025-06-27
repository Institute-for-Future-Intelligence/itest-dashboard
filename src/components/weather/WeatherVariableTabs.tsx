import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography, IconButton, Tooltip } from '@mui/material';
import { Schedule, DateRange, ExpandLess, ExpandMore } from '@mui/icons-material';
import VariableSelector from './VariableSelector';
import { useWeatherStore } from '../../store/useWeatherStore';
import { HOURLY_VARIABLES, DAILY_VARIABLES } from '../../utils/weatherConfig';

interface WeatherVariableTabsProps {
  selectedHourlyVariables: string[];
  selectedDailyVariables: string[];
  onHourlyVariablesChange: (variables: string[]) => void;
  onDailyVariablesChange: (variables: string[]) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`variable-tabpanel-${index}`}
      aria-labelledby={`variable-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const WeatherVariableTabs = ({
  selectedHourlyVariables,
  selectedDailyVariables,
  onHourlyVariablesChange,
  onDailyVariablesChange,
}: WeatherVariableTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Use Zustand store for collapse state
  const { isVariableSelectorCollapsed, toggleVariableSelectorCollapse } = useWeatherStore();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const totalSelectedCount = selectedHourlyVariables.length + selectedDailyVariables.length;

  return (
    <Paper sx={{ mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="weather variable selection tabs"
            sx={{ 
              flex: 1,
              '& .MuiTab-root': {
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
              }
            }}
          >
            <Tab
              icon={<Schedule />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Hourly Variables
                  </Typography>
                  {selectedHourlyVariables.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        px: 0.75,
                        py: 0.25,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: 2,
                        fontWeight: 600,
                        minWidth: '20px',
                        textAlign: 'center'
                      }}
                    >
                      {selectedHourlyVariables.length}
                    </Typography>
                  )}
                </Box>
              }
              iconPosition="start"
              id="variable-tab-0"
              aria-controls="variable-tabpanel-0"
              sx={{
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
              }}
            />
            <Tab
              icon={<DateRange />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Daily Variables
                  </Typography>
                  {selectedDailyVariables.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        px: 0.75,
                        py: 0.25,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: 2,
                        fontWeight: 600,
                        minWidth: '20px',
                        textAlign: 'center'
                      }}
                    >
                      {selectedDailyVariables.length}
                    </Typography>
                  )}
                </Box>
              }
              iconPosition="start"
              id="variable-tab-1"
              aria-controls="variable-tabpanel-1"
              sx={{
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
              }}
            />
          </Tabs>
          
          {/* Collapse/Expand Button */}
          <Tooltip title={isVariableSelectorCollapsed ? "Expand variable selection" : "Collapse variable selection"}>
            <IconButton 
              onClick={toggleVariableSelectorCollapse}
              size="small"
              sx={{ 
                ml: 2,
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
              }}
            >
              {isVariableSelectorCollapsed ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tab Content - Collapsible */}
      {!isVariableSelectorCollapsed && (
        <>
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 3 }}>
              <VariableSelector
                title="Select Hourly Weather Variables"
                variables={HOURLY_VARIABLES}
                selectedVariables={selectedHourlyVariables}
                onVariableChange={onHourlyVariablesChange}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 3 }}>
              <VariableSelector
                title="Select Daily Weather Variables"
                variables={DAILY_VARIABLES}
                selectedVariables={selectedDailyVariables}
                onVariableChange={onDailyVariablesChange}
              />
            </Box>
          </TabPanel>
        </>
      )}

      {/* Summary Information - Always visible when there are selections */}
      {totalSelectedCount > 0 && (
        <Box 
          sx={{ 
            px: 3, 
            py: isVariableSelectorCollapsed ? 1.5 : 1, 
            borderTop: isVariableSelectorCollapsed ? 0 : 1, 
            borderColor: 'divider',
            backgroundColor: isVariableSelectorCollapsed ? 'primary.light' : 'grey.50',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Typography 
            variant="body2" 
            color={isVariableSelectorCollapsed ? 'primary.contrastText' : 'text.secondary'}
            sx={{ fontWeight: isVariableSelectorCollapsed ? 600 : 400 }}
          >
            <strong>{totalSelectedCount}</strong> variable{totalSelectedCount !== 1 ? 's' : ''} selected
            {selectedHourlyVariables.length > 0 && selectedDailyVariables.length > 0 && 
              ` (${selectedHourlyVariables.length} hourly, ${selectedDailyVariables.length} daily)`
            }
            {isVariableSelectorCollapsed && (
              <Typography component="span" variant="caption" sx={{ ml: 2, opacity: 0.8 }}>
                Click expand to modify selections
              </Typography>
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherVariableTabs; 