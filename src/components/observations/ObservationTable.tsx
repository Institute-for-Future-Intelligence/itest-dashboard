import React, { useEffect } from 'react';
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  FilterList,
  Clear,
  ErrorOutline,
  WarningAmber,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useObservationStore } from '../../store/useObservationStore';
import {
  SEAWEED_SPECIES,
  OBSERVATION_LOCATIONS,
  SPECIES_COLORS,
  type SeaweedObservation,
} from '../../types/observation';

const reliabilityIcon = {
  reliable:  <CheckCircleOutline fontSize="small" color="success" />,
  uncertain: <WarningAmber fontSize="small" color="warning" />,
  flagged:   <ErrorOutline fontSize="small" color="error" />,
};

const formatTemp = (obs: SeaweedObservation): string => {
  if (obs.temperature === undefined) return '—';
  return `${obs.temperature}°${obs.temperatureUnit ?? 'F'}`;
};

const speciesLabel = (value: string) =>
  SEAWEED_SPECIES.find(s => s.value === value)?.label ?? value;

const locationLabel = (value: string) =>
  OBSERVATION_LOCATIONS.find(l => l.value === value)?.label ?? value;

// ─── Mobile card ────────────────────────────────────────────────────────────
const MobileCard: React.FC<{ obs: SeaweedObservation; expanded: boolean; onToggle: () => void }> = ({
  obs, expanded, onToggle,
}) => (
  <Card variant="outlined" sx={{ mb: 1 }}>
    <CardContent sx={{ pb: '8px !important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Chip
            label={speciesLabel(obs.species)}
            size="small"
            sx={{ bgcolor: SPECIES_COLORS[obs.species] ?? '#6b7280', color: '#fff', mb: 0.5 }}
          />
          <Typography variant="caption" display="block" color="text.secondary">
            {obs.date} · {obs.observer}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {obs.dataReliability && reliabilityIcon[obs.dataReliability]}
          <IconButton size="small" onClick={onToggle}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
        {obs.wetMassGrams !== undefined && (
          <Box>
            <Typography variant="caption" color="text.secondary">Mass</Typography>
            <Typography variant="body2" fontWeight={600}>{obs.wetMassGrams} g</Typography>
          </Box>
        )}
        {obs.salinity !== undefined && (
          <Box>
            <Typography variant="caption" color="text.secondary">Salinity</Typography>
            <Typography variant="body2">{obs.salinity} ppt</Typography>
          </Box>
        )}
        {obs.ph !== undefined && (
          <Box>
            <Typography variant="caption" color="text.secondary">pH</Typography>
            <Typography variant="body2">{obs.ph}</Typography>
          </Box>
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Location: {locationLabel(obs.location)}
          </Typography>
          {obs.temperature !== undefined && (
            <Typography variant="caption" color="text.secondary" display="block">
              Temp: {formatTemp(obs)}
            </Typography>
          )}
          {obs.dissolvedOxygen !== undefined && (
            <Typography variant="caption" color="text.secondary" display="block">
              DO: {obs.dissolvedOxygen} mg/L
            </Typography>
          )}
          {obs.waterExchangePercent !== undefined && (
            <Typography variant="caption" color="text.secondary" display="block">
              Water exchange: {obs.waterExchangePercent}%
              {obs.waterExchangeSource && ` from ${obs.waterExchangeSource}`}
            </Typography>
          )}
          {obs.lightWhitePercent !== undefined && (
            <Typography variant="caption" color="text.secondary" display="block">
              Lighting — W:{obs.lightWhitePercent}% R:{obs.lightRedPercent ?? '—'}% B:{obs.lightBluePercent ?? '—'}%
            </Typography>
          )}
          {obs.healthNotes && (
            <Typography variant="caption" color="text.secondary" display="block">
              Health: {obs.healthNotes}
            </Typography>
          )}
          {obs.generalNotes && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic' }}>
              {obs.generalNotes}
            </Typography>
          )}
          {obs.sensorIssuesNoted && (
            <Chip label="Sensor issues" color="warning" size="small" sx={{ mt: 0.5 }} />
          )}
        </Box>
      </Collapse>
    </CardContent>
  </Card>
);

// ─── Filters bar ────────────────────────────────────────────────────────────
const FiltersBar: React.FC = () => {
  const { filterUI, setFilterExpanded, setLocalFilters, applyLocalFilters, clearFilters, getActiveFiltersCount } =
    useObservationStore();
  const { isExpanded, localFilters } = filterUI;
  const activeCount = getActiveFiltersCount();

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          startIcon={<FilterList />}
          variant={activeCount > 0 ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setFilterExpanded(!isExpanded)}
        >
          Filters {activeCount > 0 && `(${activeCount})`}
        </Button>
        {activeCount > 0 && (
          <Button startIcon={<Clear />} size="small" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </Box>

      <Collapse in={isExpanded}>
        <Paper sx={{ p: 2, mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Species</InputLabel>
                <Select
                  value={localFilters.species ?? ''}
                  label="Species"
                  onChange={e => setLocalFilters({ ...localFilters, species: e.target.value || undefined })}
                >
                  <MenuItem value="">All species</MenuItem>
                  {SEAWEED_SPECIES.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={localFilters.location ?? ''}
                  label="Location"
                  onChange={e => setLocalFilters({ ...localFilters, location: e.target.value || undefined })}
                >
                  <MenuItem value="">All locations</MenuItem>
                  {OBSERVATION_LOCATIONS.map(l => (
                    <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="From date"
                type="date"
                fullWidth
                size="small"
                value={localFilters.dateRange?.start.toISOString().split('T')[0] ?? ''}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : undefined;
                  setLocalFilters({
                    ...localFilters,
                    dateRange: d
                      ? { start: d, end: localFilters.dateRange?.end ?? new Date() }
                      : undefined,
                  });
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="To date"
                type="date"
                fullWidth
                size="small"
                value={localFilters.dateRange?.end.toISOString().split('T')[0] ?? ''}
                onChange={e => {
                  const d = e.target.value ? new Date(e.target.value) : undefined;
                  setLocalFilters({
                    ...localFilters,
                    dateRange: d
                      ? { start: localFilters.dateRange?.start ?? new Date('2020-01-01'), end: d }
                      : undefined,
                  });
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="small" onClick={applyLocalFilters}>
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

// ─── Main table ─────────────────────────────────────────────────────────────
const ObservationTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    data,
    loading,
    error,
    table,
    loadData,
    setPage,
    setRowsPerPage,
    toggleRowExpansion,
    getFilteredData,
    getPaginatedData,
  } = useObservationStore();

  useEffect(() => {
    loadData({ sortBy: 'date', sortOrder: 'desc' });
  }, [loadData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No observations yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the "Add Observation" tab to record your first seaweed measurement.
        </Typography>
      </Paper>
    );
  }

  const filteredData = getFilteredData();
  const paginatedData = getPaginatedData();

  if (isMobile) {
    return (
      <Box>
        <FiltersBar />
        {paginatedData.map(obs => (
          <MobileCard
            key={obs.id}
            obs={obs}
            expanded={table.expandedRows.has(obs.id)}
            onToggle={() => toggleRowExpansion(obs.id)}
          />
        ))}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(_e, p) => setPage(p)}
          onRowsPerPageChange={e => setRowsPerPage(Number(e.target.value))}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
    );
  }

  return (
    <Box>
      <FiltersBar />
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Mass (g)</TableCell>
              <TableCell align="right">Salinity (ppt)</TableCell>
              <TableCell align="right">Temp</TableCell>
              <TableCell align="right">pH</TableCell>
              <TableCell align="right">DO (mg/L)</TableCell>
              <TableCell>Observer</TableCell>
              <TableCell align="center">Quality</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(obs => {
              const isExpanded = table.expandedRows.has(obs.id);
              return (
                <React.Fragment key={obs.id}>
                  <TableRow hover>
                    <TableCell>{obs.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={speciesLabel(obs.species)}
                        size="small"
                        sx={{ bgcolor: SPECIES_COLORS[obs.species] ?? '#6b7280', color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{locationLabel(obs.location)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {obs.wetMassGrams !== undefined ? (
                        <Typography fontWeight={600}>{obs.wetMassGrams}</Typography>
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right">{obs.salinity ?? '—'}</TableCell>
                    <TableCell align="right">{formatTemp(obs)}</TableCell>
                    <TableCell align="right">
                      {obs.ph !== undefined ? (
                        <Tooltip title={obs.sensorIssuesNoted ? 'Sensor issues noted' : ''}>
                          <Box component="span" sx={{ color: obs.ph < 6 ? 'error.main' : 'inherit' }}>
                            {obs.ph}
                          </Box>
                        </Tooltip>
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right">{obs.dissolvedOxygen ?? '—'}</TableCell>
                    <TableCell>{obs.observer}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={obs.dataReliability ?? 'reliable'}>
                        <Box component="span">
                          {obs.dataReliability ? reliabilityIcon[obs.dataReliability] : reliabilityIcon.reliable}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleRowExpansion(obs.id)}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {/* Expanded detail row */}
                  <TableRow>
                    <TableCell colSpan={11} sx={{ py: 0 }}>
                      <Collapse in={isExpanded}>
                        <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Stack direction="row" flexWrap="wrap" gap={3}>
                            {obs.waterExchangePercent !== undefined && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Water exchange
                                </Typography>
                                <Typography variant="body2">
                                  {obs.waterExchangePercent}%
                                  {obs.waterExchangeSource && ` — ${obs.waterExchangeSource}`}
                                </Typography>
                              </Box>
                            )}
                            {obs.lightWhitePercent !== undefined && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Lighting ({obs.lightScheduleStart ?? '?'}–{obs.lightScheduleEnd ?? '?'})
                                </Typography>
                                <Typography variant="body2">
                                  W:{obs.lightWhitePercent}% R:{obs.lightRedPercent ?? '—'}% B:{obs.lightBluePercent ?? '—'}%
                                </Typography>
                              </Box>
                            )}
                            {obs.containerVolume !== undefined && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Container</Typography>
                                <Typography variant="body2">{obs.containerVolume} {obs.containerVolumeUnit}</Typography>
                              </Box>
                            )}
                            {obs.nutrientsAdded && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Nutrients added</Typography>
                                <Typography variant="body2">{obs.nutrientsAdded}</Typography>
                              </Box>
                            )}
                            {obs.colorDescription && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Color</Typography>
                                <Typography variant="body2">{obs.colorDescription}</Typography>
                              </Box>
                            )}
                            {obs.healthNotes && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Health</Typography>
                                <Typography variant="body2">{obs.healthNotes}</Typography>
                              </Box>
                            )}
                            {obs.generalNotes && (
                              <Box sx={{ flexBasis: '100%' }}>
                                <Typography variant="caption" color="text.secondary" display="block">Notes</Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{obs.generalNotes}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={(_e, p) => setPage(p)}
        onRowsPerPageChange={e => setRowsPerPage(Number(e.target.value))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default ObservationTable;
