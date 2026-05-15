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

/**
 * Row 1 = what educators see; row 2 = field keys (keep for future upload — copy/paste or hide row 2 in Excel if you prefer).
 * Order matches Firestore / observation form.
 */
const OBS_COLUMNS = [
  { key: 'date', title: 'Date (YYYY-MM-DD)' },
  { key: 'time', title: 'Time (24-hour HH:MM)' },
  { key: 'observer', title: 'Observer (your name)' },
  { key: 'location', title: 'Location code' },
  { key: 'species', title: 'Species code' },
  { key: 'wet_mass_grams', title: 'Wet mass (grams)' },
  { key: 'salinity_ppt', title: 'Salinity (ppt)' },
  { key: 'temperature', title: 'Temperature (number)' },
  { key: 'temperature_unit', title: 'Temperature unit (F or C)' },
  { key: 'ph', title: 'pH' },
  { key: 'dissolved_oxygen_mg_l', title: 'Dissolved oxygen (mg/L)' },
  { key: 'container_volume', title: 'Container volume (number)' },
  { key: 'container_volume_unit', title: 'Volume unit (gallons or liters)' },
  { key: 'light_schedule_start', title: 'Lights on (HH:MM)' },
  { key: 'light_schedule_end', title: 'Lights off (HH:MM)' },
  { key: 'light_white_percent', title: 'Light — white % (0–100)' },
  { key: 'light_red_percent', title: 'Light — red % (0–100)' },
  { key: 'light_blue_percent', title: 'Light — blue % (0–100)' },
  { key: 'water_exchange_percent', title: 'Water exchange % (0–100)' },
  { key: 'water_exchange_source', title: 'Water exchange source (text)' },
  { key: 'nutrients_added', title: 'Nutrients added (text)' },
  { key: 'color_description', title: 'Color / appearance (text)' },
  { key: 'health_notes', title: 'Health notes (text)' },
  { key: 'general_notes', title: 'Session / setup notes (text)' },
  { key: 'sensor_issues', title: 'Sensor issues? (TRUE or FALSE)' },
  { key: 'data_reliability', title: 'Reliability (reliable / uncertain / flagged)' },
];

const OBS_HEADERS = OBS_COLUMNS.map((c) => c.key);
const OBS_TITLE_ROW = OBS_COLUMNS.map((c) => c.title);

/** Label row directly under keys — helps orient users in a wide sheet */
function exampleBannerRow() {
  const row = Array(OBS_COLUMNS.length).fill('');
  row[0] = '▼ Example rows only — delete before sending your file ▼';
  return row;
}

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
  const n = OBS_COLUMNS.length;
  const lastCol = XLSX.utils.encode_col(n - 1);
  const blankDataRows = Array.from({ length: 14 }, () => Array(n).fill(''));
  const aoa = [OBS_TITLE_ROW, OBS_HEADERS, exampleBannerRow(), ...EXAMPLE_ROWS, ...blankDataRows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const lastRow = aoa.length;
  ws['!cols'] = OBS_COLUMNS.map((c) => ({
    wch: Math.min(Math.max(c.title.length, c.key.length, 12) + 2, 44),
  }));
  ws['!autofilter'] = { ref: `A1:${lastCol}${lastRow}` };
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
    ['OBSERVATIONS SHEET LAYOUT'],
    [''],
    ['Row 1 — Column titles: use these to know what goes in each column.'],
    ['Row 2 — Technical field names: keep this row for automated import later; you can hide row 2 in Excel (Format → Hide) if it distracts you.'],
    ['Row 3 — Reminder banner; then sample rows you should delete.'],
    ['Empty rows below are for your data — add more rows in Excel as needed.'],
    [''],
    ['WHO: Fill "Observations" and email the file back (or upload when the team enables file import).'],
    [''],
    ['ONE ROW = ONE observation in the database.'],
    ['  • Green + red sample same day → TWO rows (same date, time, location; different species codes and wet masses).'],
    ['  • Whole-system total mass only → one row, species code "other" (see Allowed_codes + examples).'],
    ['  • Always copy location & species codes from "Allowed_codes".'],
    [''],
    ['REQUIRED FOR EACH ROW'],
    ['  Date (row 1 title "Date…") — YYYY-MM-DD. Time — 24-hour HH:MM. Observer — your name.'],
    ['  Location code — e.g. fhw205_large_growth_chamber. Species code — e.g. ogo_manuea or lepe_lepe.'],
    [''],
    ['CORE MEASUREMENTS (leave blank if not measured)'],
    ['  Wet mass (g), Salinity (ppt), and any optional water-quality / lighting columns.'],
    [''],
    ['OPTIONAL — water quality / system'],
    ['  Temperature + unit (F or C), pH, dissolved O₂, container volume + unit, lighting %, water exchange, nutrients.'],
    [''],
    ['NOTES'],
    ['  Color, health, and session notes — free text. Sensor issues — TRUE or FALSE. Reliability — see Allowed_codes.'],
    [''],
    ['TIP: Green + red sample same day = two rows (same date/time/location; different species and mass).'],
    [''],
    ['After entering data, delete the example rows. Keep row 1 + row 2 headers.'],
    [''],
    ['Version: generated from repo scripts. Lists match src/types/observation.ts.'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(lines);
  ws['!cols'] = [{ wch: 110 }];
  return ws;
}

function sheetColumnReference() {
  const rows = [['Excel column title (row 1)', 'Field key (row 2)', 'Example']];
  const defs = [
    ['Date (YYYY-MM-DD)', 'date', '2026-05-12'],
    ['Time (24-hour HH:MM)', 'time', '09:00'],
    ['Observer (your name)', 'observer', 'Ken Kozuma'],
    ['Location code', 'location', 'castle_outdoor_tumble_tank'],
    ['Species code', 'species', 'ogo_manuea'],
    ['Wet mass (grams)', 'wet_mass_grams', '15.6'],
    ['Salinity (ppt)', 'salinity_ppt', '27.5'],
    ['Temperature (number)', 'temperature', '71.6'],
    ['Temperature unit (F or C)', 'temperature_unit', 'F'],
    ['pH', 'ph', '8.2'],
    ['Dissolved oxygen (mg/L)', 'dissolved_oxygen_mg_l', '8.1'],
    ['Container volume (number)', 'container_volume', '2'],
    ['Volume unit (gallons or liters)', 'container_volume_unit', 'gallons'],
    ['Lights on (HH:MM)', 'light_schedule_start', '08:00'],
    ['Lights off (HH:MM)', 'light_schedule_end', '18:00'],
    ['Light — white % (0–100)', 'light_white_percent', '3'],
    ['Light — red % (0–100)', 'light_red_percent', '3'],
    ['Light — blue % (0–100)', 'light_blue_percent', '3'],
    ['Water exchange % (0–100)', 'water_exchange_percent', '25'],
    ['Water exchange source (text)', 'water_exchange_source', 'main aquaponic system'],
    ['Nutrients added (text)', 'nutrients_added', ''],
    ['Color / appearance (text)', 'color_description', 'Outdoor full color'],
    ['Health notes (text)', 'health_notes', ''],
    ['Session / setup notes (text)', 'general_notes', 'Day 6 follow-up…'],
    ['Sensor issues? (TRUE or FALSE)', 'sensor_issues', 'FALSE'],
    ['Reliability (reliable / uncertain / flagged)', 'data_reliability', 'reliable'],
  ];
  rows.push(...defs);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 36 }, { wch: 28 }, { wch: 28 }];
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
