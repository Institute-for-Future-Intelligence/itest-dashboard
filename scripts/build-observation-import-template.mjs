/**
 * Generates public/templates/seaweed-observations-import-template.xlsx
 * for educators to fill in (July PD, etc.). Shipped with the GitHub Pages build.
 * Re-run after updating species/location lists in src/types/observation.ts — keep *_LIST in sync.
 *
 *   npm run template:observations
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/templates');
const outFile = path.join(outDir, 'seaweed-observations-import-template.xlsx');

/** @type {readonly [string, string][]} value, label — sync with SEAWEED_SPECIES */
const SPECIES_LIST = [
  ['ogo_manuea', 'Ogo (Manuea)'],
  ['lepe_lepe', 'Lepe Lepe'],
  ['limu_kohu', 'Limu Kohu'],
  ['sea_asparagus', 'Sea Asparagus'],
  ['other', 'Other / mixed total / system-wide weigh-in'],
];

/** @type {readonly [string, string][]} value, label — sync with OBSERVATION_LOCATIONS */
const LOCATION_LIST = [
  ['fh_107_growth_chamber', 'FH-107 Growth Chamber'],
  ['fhw205_large_growth_chamber', 'Large Growth Chamber (fhw205, Castle HS)'],
  ['fhw109_small_growth_chamber', 'Small Growth Chamber (fhw109, Castle HS)'],
  ['castle_outdoor_tumble_tank', 'Outdoor Tumble Tank (Castle HS)'],
  ['2gal_bucket', '2-Gallon Bucket'],
  ['40gal_tub', '40-Gallon Tub'],
  ['main_500gal_tank', 'Main 500-Gallon Tank'],
  ['flatbed_1', '8-Ft Flatbed #1 (Limu Kohu)'],
  ['flatbed_2', '8-Ft Flatbed #2 (Sea Asparagus)'],
  ['other', 'Other'],
];

const RELIABILITY = ['reliable', 'uncertain', 'flagged'];
const TEMP_UNITS = ['F', 'C'];
const VOLUME_UNITS = ['gallons', 'liters'];

const OBS_HEADERS = [
  'date',
  'time',
  'observer',
  'location',
  'species',
  'wet_mass_grams',
  'salinity_ppt',
  'temperature',
  'temperature_unit',
  'ph',
  'dissolved_oxygen_mg_l',
  'container_volume',
  'container_volume_unit',
  'light_schedule_start',
  'light_schedule_end',
  'light_white_percent',
  'light_red_percent',
  'light_blue_percent',
  'water_exchange_percent',
  'water_exchange_source',
  'nutrients_added',
  'color_description',
  'health_notes',
  'general_notes',
  'sensor_issues',
  'data_reliability',
];

/** Example rows: same pattern as Castle HS emails (one row per sample or total). */
const EXAMPLE_ROWS = [
  [
    '2026-05-12',
    '09:00',
    'Ken Kozuma',
    'fhw205_large_growth_chamber',
    'ogo_manuea',
    15.6,
    27.5,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    3,
    3,
    3,
    '',
    '',
    '',
    '',
    '',
    'Day 6 — DELETE this row and add your own.',
    'FALSE',
    'reliable',
  ],
  [
    '2026-05-12',
    '09:01',
    'Ken Kozuma',
    'fhw205_large_growth_chamber',
    'lepe_lepe',
    6.0,
    27.5,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'FALSE',
    'reliable',
  ],
  [
    '2026-05-12',
    '10:00',
    'Ken Kozuma',
    'main_500gal_tank',
    'other',
    244.4,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Example: total mixed biomass for main system (one row). DELETE before send.',
    'FALSE',
    'uncertain',
  ],
];

function sheetObservations() {
  const aoa = [OBS_HEADERS, ...EXAMPLE_ROWS];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = OBS_HEADERS.map((h) => ({
    wch: Math.max(h.length, 12),
  }));
  return ws;
}

function sheetAllowedCodes() {
  const rows = [['category', 'code', 'label']];
  for (const [code, label] of SPECIES_LIST) {
    rows.push(['species', code, label]);
  }
  for (const [code, label] of LOCATION_LIST) {
    rows.push(['location', code, label]);
  }
  for (const r of RELIABILITY) {
    rows.push(['data_reliability', r, '']);
  }
  for (const u of TEMP_UNITS) {
    rows.push(['temperature_unit', u, u === 'F' ? 'Fahrenheit' : 'Celsius']);
  }
  for (const u of VOLUME_UNITS) {
    rows.push(['container_volume_unit', u, '']);
  }
  rows.push(['sensor_issues', 'TRUE or FALSE', 'Use uppercase TRUE/FALSE in Observations sheet']);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 22 }, { wch: 36 }, { wch: 48 }];
  return ws;
}

function sheetHowToUse() {
  const lines = [
    ['Seaweed observations — Excel template for Nā Puna ʻIke dashboard'],
    [''],
    ['WHO: Fill one sheet ("Observations") and email the file back (or upload when the team enables file import).'],
    [''],
    ['ONE ROW = ONE observation in the database.'],
    ['  • If you weigh a "green" sample and a "red" sample the same day, use TWO rows (same date/time/location, different species and wet_mass_grams).'],
    ['  • If you record only combined total limu mass for a whole system, use one row with species = other (see examples).'],
    [''],
    ['REQUIRED COLUMNS'],
    ['  date — Use YYYY-MM-DD (e.g. 2026-05-12).'],
    ['  time — 24-hour HH:MM (e.g. 09:00). If unknown, use 09:00.'],
    ['  observer — Your name as you want it stored.'],
    ['  location — Copy the short code from sheet "Allowed_codes" (e.g. fhw205_large_growth_chamber).'],
    ['  species — Copy code from "Allowed_codes". Green chamber sample → often ogo_manuea; red sample → often lepe_lepe; system total → other.'],
    [''],
    ['CORE MEASUREMENTS (use what you have; leave cells blank if not measured)'],
    ['  wet_mass_grams — Wet biomass in grams.'],
    ['  salinity_ppt — Salinity in ppt at the same session as the weigh-in, if you measured it.'],
    [''],
    ['OPTIONAL — water quality / system'],
    ['  temperature + temperature_unit (F or C), ph, dissolved_oxygen_mg_l'],
    ['  container_volume + container_volume_unit (gallons or liters)'],
    ['  Lighting: light_schedule_start/end (HH:MM), light_white_percent, light_red_percent, light_blue_percent (0–100).'],
    ['  Interventions: water_exchange_percent, water_exchange_source, nutrients_added'],
    [''],
    ['NOTES'],
    ['  color_description, health_notes, general_notes — free text.'],
    ['  sensor_issues — TRUE or FALSE (equipment acting oddly).'],
    ['  data_reliability — reliable | uncertain | flagged (see Allowed_codes).'],
    [''],
    ['TIP: Ken often sends Initial / Day 2 / Day 6 tables — each date gets new rows; same session can share time and salinity on both species rows.'],
    [''],
    ['After entering data, DELETE the three example rows in "Observations" before sending the file.'],
    [''],
    ['Version: generated from repo scripts. Lists match src/types/observation.ts.'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(lines);
  ws['!cols'] = [{ wch: 110 }];
  return ws;
}

function sheetColumnReference() {
  const rows = [['column_name', 'meaning', 'example']];
  const defs = [
    ['date', 'Collection date', '2026-05-12'],
    ['time', 'Time of reading (24h)', '09:00'],
    ['observer', 'Person recording', 'Ken Kozuma'],
    ['location', 'Site code from Allowed_codes', 'castle_outdoor_tumble_tank'],
    ['species', 'Taxon or "other" for totals', 'ogo_manuea'],
    ['wet_mass_grams', 'Wet mass (g)', '15.6'],
    ['salinity_ppt', 'Salinity (ppt)', '27.5'],
    ['temperature', 'Number only', '71.6'],
    ['temperature_unit', 'F or C', 'F'],
    ['ph', 'pH reading', '8.2'],
    ['dissolved_oxygen_mg_l', 'DO mg/L', '8.1'],
    ['container_volume', 'Number only', '2'],
    ['container_volume_unit', 'gallons or liters', 'gallons'],
    ['light_schedule_start', 'Lights on HH:MM', '08:00'],
    ['light_schedule_end', 'Lights off HH:MM', '18:00'],
    ['light_white_percent', '0–100', '3'],
    ['light_red_percent', '0–100', '3'],
    ['light_blue_percent', '0–100', '3'],
    ['water_exchange_percent', '0–100', '25'],
    ['water_exchange_source', 'Text', 'main aquaponic system'],
    ['nutrients_added', 'Text', ''],
    ['color_description', 'Text', 'Outdoor full color'],
    ['health_notes', 'Text', ''],
    ['general_notes', 'Text', 'Day 6 follow-up…'],
    ['sensor_issues', 'TRUE or FALSE', 'FALSE'],
    ['data_reliability', 'reliable / uncertain / flagged', 'reliable'],
  ];
  rows.push(...defs);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 26 }, { wch: 52 }, { wch: 28 }];
  return ws;
}

fs.mkdirSync(outDir, { recursive: true });
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, sheetHowToUse(), 'How_to_use');
XLSX.utils.book_append_sheet(wb, sheetObservations(), 'Observations');
XLSX.utils.book_append_sheet(wb, sheetAllowedCodes(), 'Allowed_codes');
XLSX.utils.book_append_sheet(wb, sheetColumnReference(), 'Column_reference');
XLSX.writeFile(wb, outFile);
console.log('Wrote', outFile);
