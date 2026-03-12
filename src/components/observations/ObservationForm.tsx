import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Science,
  WaterDrop,
  Lightbulb,
  SwapHoriz,
  LocalFlorist,
  Save,
} from '@mui/icons-material';
import { useObservationStore } from '../../store/useObservationStore';
import { useUserStore } from '../../store/useUserStore';
import { SEAWEED_SPECIES, OBSERVATION_LOCATIONS } from '../../types/observation';

const ObservationForm: React.FC = () => {
  const { user } = useUserStore();
  const { form, setFormData, validateForm, submitForm, resetForm, clearFormMessages } = useObservationStore();
  const { formData, isSubmitting, validation, submitSuccess, submitError } = form;

  const [lightingExpanded, setLightingExpanded] = useState(false);
  const [interventionsExpanded, setInterventionsExpanded] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: { target: { value: unknown } }) => {
    setFormData({ [field]: e.target.value });
  };

  const handleNumberChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ [field]: val === '' ? '' : Number(val) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    validateForm();
    await submitForm(user.uid);
  };

  const reliabilityColor = {
    reliable: 'success' as const,
    uncertain: 'warning' as const,
    flagged: 'error' as const,
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearFormMessages}>
          Observation saved successfully!
        </Alert>
      )}
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearFormMessages}>
          {submitError}
        </Alert>
      )}
      {validation && validation.errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Alert>
      )}
      {validation && validation.warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </Alert>
      )}

      {/* === Core Identity === */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={<LocalFlorist color="success" />}
          title="Observation Details"
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                required
                value={formData.date}
                onChange={handleChange('date')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Time"
                type="time"
                fullWidth
                required
                value={formData.time}
                onChange={handleChange('time')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Species</InputLabel>
                <Select value={formData.species} label="Species" onChange={handleSelectChange('species')}>
                  {SEAWEED_SPECIES.map(s => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                      {s.labelHawaiian && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({s.labelHawaiian})
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select value={formData.location} label="Location" onChange={handleSelectChange('location')}>
                  {OBSERVATION_LOCATIONS.map(l => (
                    <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Observer Name"
                fullWidth
                required
                value={formData.observer}
                onChange={handleChange('observer')}
                placeholder="e.g. Ken Kozuma"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Wet Mass"
                type="number"
                fullWidth
                value={formData.wetMassGrams}
                onChange={handleNumberChange('wetMassGrams')}
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">g</InputAdornment> },
                }}
                helperText="Wet biomass in grams"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* === Water Quality === */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={<WaterDrop color="primary" />}
          title="Water Quality"
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
          subheader="Optional — record readings taken at this session"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Salinity"
                type="number"
                fullWidth
                value={formData.salinity}
                onChange={handleNumberChange('salinity')}
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">ppt</InputAdornment> },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <TextField
                  label="Temperature"
                  type="number"
                  fullWidth
                  value={formData.temperature}
                  onChange={handleNumberChange('temperature')}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">°{formData.temperatureUnit}</InputAdornment>
                      ),
                    },
                  }}
                />
                <ToggleButtonGroup
                  value={formData.temperatureUnit}
                  exclusive
                  size="small"
                  onChange={(_e, val) => { if (val) setFormData({ temperatureUnit: val }); }}
                  sx={{ mt: 0.5 }}
                >
                  <ToggleButton value="F">°F</ToggleButton>
                  <ToggleButton value="C">°C</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="pH"
                type="number"
                fullWidth
                value={formData.ph}
                onChange={handleNumberChange('ph')}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Dissolved Oxygen"
                type="number"
                fullWidth
                value={formData.dissolvedOxygen}
                onChange={handleNumberChange('dissolvedOxygen')}
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">mg/L</InputAdornment> },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Container Volume"
                type="number"
                fullWidth
                value={formData.containerVolume}
                onChange={handleNumberChange('containerVolume')}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">{formData.containerVolumeUnit}</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Volume Unit</InputLabel>
                <Select
                  value={formData.containerVolumeUnit}
                  label="Volume Unit"
                  onChange={handleSelectChange('containerVolumeUnit')}
                >
                  <MenuItem value="gallons">Gallons</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* === Lighting (collapsible) === */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={<Lightbulb color="warning" />}
          title="Lighting Configuration"
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
          subheader="Record only when changed or newly set"
          action={
            <Button
              size="small"
              endIcon={lightingExpanded ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setLightingExpanded(v => !v)}
            >
              {lightingExpanded ? 'Hide' : 'Show'}
            </Button>
          }
        />
        <Collapse in={lightingExpanded}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Schedule Start"
                  type="time"
                  fullWidth
                  value={formData.lightScheduleStart}
                  onChange={handleChange('lightScheduleStart')}
                  slotProps={{ inputLabel: { shrink: true } }}
                  helperText="e.g. 08:00"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Schedule End"
                  type="time"
                  fullWidth
                  value={formData.lightScheduleEnd}
                  onChange={handleChange('lightScheduleEnd')}
                  slotProps={{ inputLabel: { shrink: true } }}
                  helperText="e.g. 18:00"
                />
              </Grid>
              {(['lightWhitePercent', 'lightRedPercent', 'lightBluePercent'] as const).map((field, i) => (
                <Grid key={field} size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={['White %', 'Red %', 'Blue %'][i]}
                    type="number"
                    fullWidth
                    value={formData[field]}
                    onChange={handleNumberChange(field)}
                    inputProps={{ min: 0, max: 100 }}
                    slotProps={{
                      input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* === Interventions (collapsible) === */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={<SwapHoriz color="info" />}
          title="System Interventions"
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
          subheader="Water exchanges, nutrients, or other actions performed"
          action={
            <Button
              size="small"
              endIcon={interventionsExpanded ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setInterventionsExpanded(v => !v)}
            >
              {interventionsExpanded ? 'Hide' : 'Show'}
            </Button>
          }
        />
        <Collapse in={interventionsExpanded}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Water Exchange"
                  type="number"
                  fullWidth
                  value={formData.waterExchangePercent}
                  onChange={handleNumberChange('waterExchangePercent')}
                  inputProps={{ min: 0, max: 100 }}
                  slotProps={{
                    input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Water Exchange Source"
                  fullWidth
                  value={formData.waterExchangeSource}
                  onChange={handleChange('waterExchangeSource')}
                  placeholder="e.g. main aquaponic system, fresh ocean water"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nutrients / Additives Added"
                  fullWidth
                  value={formData.nutrientsAdded}
                  onChange={handleChange('nutrientsAdded')}
                  placeholder="e.g. Miracle Gro, fertilizer type & amount"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* === Health & Notes === */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={<Science color="secondary" />}
          title="Health & Observations"
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Color Description"
                fullWidth
                value={formData.colorDescription}
                onChange={handleChange('colorDescription')}
                placeholder="e.g. vibrant green, pale, browning at tips"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Health Notes"
                fullWidth
                value={formData.healthNotes}
                onChange={handleChange('healthNotes')}
                placeholder="e.g. crisp and firm, wilting, stable"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="General Notes"
                fullWidth
                multiline
                rows={3}
                value={formData.generalNotes}
                onChange={handleChange('generalNotes')}
                placeholder="Any additional context, system status, or observations..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* === Data Quality === */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Data Reliability</InputLabel>
                <Select
                  value={formData.dataReliability}
                  label="Data Reliability"
                  onChange={handleSelectChange('dataReliability')}
                  renderValue={(val) => (
                    <Chip
                      label={val.charAt(0).toUpperCase() + val.slice(1)}
                      color={reliabilityColor[val as keyof typeof reliabilityColor]}
                      size="small"
                    />
                  )}
                >
                  <MenuItem value="reliable">
                    <Chip label="Reliable" color="success" size="small" sx={{ mr: 1 }} />
                    Readings verified and trustworthy
                  </MenuItem>
                  <MenuItem value="uncertain">
                    <Chip label="Uncertain" color="warning" size="small" sx={{ mr: 1 }} />
                    Readings may need verification
                  </MenuItem>
                  <MenuItem value="flagged">
                    <Chip label="Flagged" color="error" size="small" sx={{ mr: 1 }} />
                    Known sensor or collection issue
                  </MenuItem>
                </Select>
                <FormHelperText>
                  Flag readings with known sensor issues (e.g. Growth Chamber pH sensor errors)
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sensorIssuesNoted}
                    onChange={(e) => setFormData({ sensorIssuesNoted: e.target.checked })}
                    color="warning"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">Sensor issues noted</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Check if any sensor gave suspicious or erroneous readings
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={resetForm} disabled={isSubmitting}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : <Save />}
        >
          {isSubmitting ? 'Saving…' : 'Save Observation'}
        </Button>
      </Box>
    </Box>
  );
};

export default ObservationForm;
