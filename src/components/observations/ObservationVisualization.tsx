import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { observationService } from '../../firebase/observationService';
import { SEAWEED_SPECIES, SPECIES_COLORS, type SeaweedObservation } from '../../types/observation';

// Convert °F to °C for uniform charting
const toC = (temp: number, unit?: string) =>
  unit === 'F' ? Math.round(((temp - 32) * 5) / 9 * 10) / 10 : temp;

interface ChartPoint {
  date: string;
  [key: string]: number | string | undefined;
}

const buildGrowthSeries = (data: SeaweedObservation[]): ChartPoint[] => {
  const byDate: Record<string, ChartPoint> = {};
  data
    .filter(o => o.wetMassGrams !== undefined)
    .forEach(o => {
      if (!byDate[o.date]) byDate[o.date] = { date: o.date };
      byDate[o.date][o.species] = o.wetMassGrams;
    });
  return Object.values(byDate).sort((a, b) => (a.date < b.date ? -1 : 1));
};

const buildWaterQualityPoints = (data: SeaweedObservation[]): ChartPoint[] => {
  const byDate: Record<string, ChartPoint> = {};
  data.forEach(o => {
    if (!byDate[o.date]) byDate[o.date] = { date: o.date };
    if (o.salinity !== undefined) byDate[o.date].salinity = o.salinity;
    if (o.ph !== undefined) byDate[o.date].ph = o.ph;
    if (o.temperature !== undefined) byDate[o.date].tempC = toC(o.temperature, o.temperatureUnit);
    if (o.dissolvedOxygen !== undefined) byDate[o.date].do = o.dissolvedOxygen;
  });
  return Object.values(byDate).sort((a, b) => (a.date < b.date ? -1 : 1));
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  unit?: string;
}> = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography variant="caption" display="block" gutterBottom fontWeight={600}>
        {label}
      </Typography>
      {payload.map(p => (
        <Typography key={p.name} variant="caption" display="block" sx={{ color: p.color }}>
          {p.name}: {p.value}{unit ?? ''}
        </Typography>
      ))}
    </Paper>
  );
};

const ObservationVisualization: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<SeaweedObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');

  useEffect(() => {
    observationService
      .getAllObservationsChronological()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(
    () => (speciesFilter === 'all' ? data : data.filter(d => d.species === speciesFilter)),
    [data, speciesFilter]
  );

  const growthPoints = useMemo(() => buildGrowthSeries(filteredData), [filteredData]);
  const wqPoints = useMemo(() => buildWaterQualityPoints(filteredData), [filteredData]);

  const speciesPresent = useMemo(
    () => [...new Set(data.map(d => d.species))],
    [data]
  );

  const axisColor = theme.palette.text.secondary;
  const gridColor = theme.palette.divider;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">No data yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Add observations to see growth and water quality charts.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Species filter */}
      <Box sx={{ mb: 3, maxWidth: 280 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Show species</InputLabel>
          <Select value={speciesFilter} label="Show species" onChange={e => setSpeciesFilter(e.target.value)}>
            <MenuItem value="all">All species</MenuItem>
            {speciesPresent.map(sp => (
              <MenuItem key={sp} value={sp}>
                {SEAWEED_SPECIES.find(s => s.value === sp)?.label ?? sp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Growth over time */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="Biomass Growth Over Time"
              subheader="Wet mass (g) per observation session"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              {growthPoints.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  No biomass data recorded yet.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={growthPoints} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 12 }} />
                    <YAxis
                      unit=" g"
                      tick={{ fill: axisColor, fontSize: 12 }}
                      label={{ value: 'Wet mass (g)', angle: -90, position: 'insideLeft', fill: axisColor, fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip unit=" g" />} />
                    <Legend />
                    {speciesPresent
                      .filter(sp => speciesFilter === 'all' || sp === speciesFilter)
                      .map(sp => (
                        <Line
                          key={sp}
                          type="monotone"
                          dataKey={sp}
                          name={SEAWEED_SPECIES.find(s => s.value === sp)?.label ?? sp}
                          stroke={SPECIES_COLORS[sp] ?? '#6b7280'}
                          strokeWidth={2}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                          connectNulls
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Salinity over time */}
        {wqPoints.some(p => p.salinity !== undefined) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Salinity" subheader="ppt" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={wqPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis unit=" ppt" tick={{ fill: axisColor, fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip unit=" ppt" />} />
                    {/* Typical ocean range reference lines */}
                    <ReferenceLine y={30} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: '30 (ocean min)', fill: '#94a3b8', fontSize: 10 }} />
                    <ReferenceLine y={35} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: '35 (ocean max)', fill: '#94a3b8', fontSize: 10 }} />
                    <Line type="monotone" dataKey="salinity" name="Salinity" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* pH over time */}
        {wqPoints.some(p => p.ph !== undefined) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="pH" subheader="Manual readings" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={wqPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis domain={[0, 14]} tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={7} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: 'neutral', fill: '#94a3b8', fontSize: 10 }} />
                    <Line type="monotone" dataKey="ph" name="pH" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Temperature over time */}
        {wqPoints.some(p => p.tempC !== undefined) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Temperature" subheader="Converted to °C" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={wqPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis unit="°C" tick={{ fill: axisColor, fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip unit="°C" />} />
                    <Line type="monotone" dataKey="tempC" name="Temperature" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Dissolved oxygen over time */}
        {wqPoints.some(p => p.do !== undefined) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Dissolved Oxygen" subheader="mg/L" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={wqPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis unit=" mg/L" tick={{ fill: axisColor, fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip unit=" mg/L" />} />
                    <Line type="monotone" dataKey="do" name="DO" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ObservationVisualization;
