/**
 * Seed script for historical seaweed observation data extracted from Ken Kozuma's emails
 * (Nov 2025 – Mar 2026).
 *
 * Usage (run once, from repo root):
 *   npx tsx scripts/seedObservations.ts
 *
 * Requires a .env file with VITE_FIREBASE_* variables (same as the app).
 * The script uses a dedicated "seed" UID so records are clearly marked as imported.
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);

const SEED_UID      = 'seed_import_ken_kozuma_emails';
const OBSERVER_NAME = 'Ken Kozuma';
const COLLECTION    = 'seaweedObservations';

interface ObservationSeed {
  date: string;
  time: string;
  species: string;
  location: string;
  observer: string;
  wetMassGrams?: number;
  salinity?: number;
  temperature?: number;
  temperatureUnit?: 'F' | 'C';
  ph?: number;
  dissolvedOxygen?: number;
  containerVolume?: number;
  containerVolumeUnit?: 'gallons' | 'liters';
  lightScheduleStart?: string;
  lightScheduleEnd?: string;
  lightWhitePercent?: number;
  lightRedPercent?: number;
  lightBluePercent?: number;
  waterExchangePercent?: number;
  waterExchangeSource?: string;
  nutrientsAdded?: string;
  colorDescription?: string;
  healthNotes?: string;
  generalNotes?: string;
  sensorIssuesNoted?: boolean;
  dataReliability?: 'reliable' | 'uncertain' | 'flagged';
}

// ---------------------------------------------------------------------------
// Historical records extracted from emails
// ---------------------------------------------------------------------------
const RECORDS: ObservationSeed[] = [
  // ── Feb 23 (morning) – initial setup ─────────────────────────────────────
  // Source: email 5 (Feb 23 morning message)
  {
    date: '2026-02-23',
    time: '12:07',
    species: 'ogo_manuea',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 14.9,
    salinity: 34.5,
    temperature: 71.6,
    temperatureUnit: 'F',
    ph: 8.36,
    containerVolume: 2,
    containerVolumeUnit: 'gallons',
    lightScheduleStart: '08:00',
    lightScheduleEnd: '18:00',
    lightWhitePercent: 80,
    lightRedPercent: 90,
    lightBluePercent: 100,
    generalNotes:
      'Initial readings. Air stone at bottom (removed for photo). Auto lights on. Growth Chamber: FH-107.',
    dataReliability: 'reliable',
  },

  // ── Feb 23 (evening) – water restart after DO anomaly ────────────────────
  // Source: email 4 (Feb 23 evening)
  {
    date: '2026-02-23',
    time: '20:24',
    species: 'ogo_manuea',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 14.9,
    salinity: 34.5,
    temperature: 71.6,
    temperatureUnit: 'F',
    ph: 8.45,
    dissolvedOxygen: 8.3,
    containerVolume: 2,
    containerVolumeUnit: 'gallons',
    sensorIssuesNoted: true,
    generalNotes:
      'Threw out all water and started fresh — lights were throwing off DO readings initially. '
      + 'Using personal sensors (not Growth Chamber Jukebox sensors). Sensors removed from bucket. '
      + 'DO same with and without aeration.',
    dataReliability: 'reliable',
  },

  // ── Feb 25 – Lepe Lepe added; lighting & water exchange ──────────────────
  // Source: email 3 (Feb 25 afternoon)
  {
    date: '2026-02-25',
    time: '16:39',
    species: 'lepe_lepe',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 25,
    containerVolume: 2,
    containerVolumeUnit: 'gallons',
    lightRedPercent: 20,
    waterExchangePercent: 25,
    waterExchangeSource: 'main aquaponic system',
    sensorIssuesNoted: true,
    healthNotes: 'Lepe lepe expected to uptake nutrients slower and grow more stable.',
    generalNotes:
      'Added 25 g of Lepe Lepe to bucket. Red light dropped to 20% after research showed red '
      + 'limu does not like red light. 25% water exchange with main system. '
      + 'pH sensor showing super low reading — likely sensor error, not true pH. '
      + 'Main system has been unstable (overflow causing salinity fluctuations). '
      + 'Ogo not as crisp as before.',
    dataReliability: 'uncertain',
  },

  // ── Feb 26 – Ogo weigh-in; salinity pushed to 31 ppt ────────────────────
  // Source: email 2 (Feb 26)
  {
    date: '2026-02-26',
    time: '09:00',
    species: 'ogo_manuea',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 17.2,
    salinity: 31,
    temperature: 70,
    temperatureUnit: 'F',
    waterExchangeSource: 'personal aquaponic system',
    sensorIssuesNoted: true,
    generalNotes:
      'Added new salt water from personal aquaponic system. Salinity pushed to 31 ppt '
      + '(ocean water typically 30–35 ppt). Growth Chamber pH sensor giving very low readings — '
      + 'using personal sensor instead. Temp sitting at upper 60s to low 70s °F.',
    dataReliability: 'uncertain',
  },

  // ── Mar 3 – Final biomass readings ───────────────────────────────────────
  // Source: email 1 (Mar 3)
  {
    date: '2026-03-03',
    time: '09:00',
    species: 'ogo_manuea',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 27.4,
    healthNotes: "Not as crisp as it used to be. Growing but doesn't seem to like this system.",
    generalNotes: 'Main system still recovering from overflow/salinity issues.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-03-03',
    time: '09:00',
    species: 'lepe_lepe',
    location: 'fh_107_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 32,
    colorDescription: 'Good color',
    healthNotes: 'Growing slower than ogo (expected). Seems healthier, color looks good.',
    dataReliability: 'reliable',
  },

  // ── Castle HS — May 6, 2026 (Initial) — green = ogo_manuea, red = lepe_lepe ─
  {
    date: '2026-05-06',
    time: '09:00',
    species: 'ogo_manuea',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 14.9,
    salinity: 24.4,
    lightWhitePercent: 3,
    lightBluePercent: 3,
    lightRedPercent: 3,
    colorDescription: 'Green biomass sample (paired with red lepe lepe sample).',
    generalNotes:
      'Castle HS — Initial (5/6). Large growth chamber fhw205. Lights 3% white, 3% blue, 3% red to mimic outdoor setup. '
      + 'Lepe lepe under light began turning green; batch kept dark stayed reddish but not the deep red expected. '
      + 'Nitrite/nitrate baseline not yet measured.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '09:01',
    species: 'lepe_lepe',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 5.2,
    salinity: 24.4,
    colorDescription: 'Red biomass sample (paired green/red samples similar size per session).',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '09:02',
    species: 'ogo_manuea',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 15.6,
    salinity: 24.4,
    lightWhitePercent: 3,
    lightBluePercent: 5,
    lightRedPercent: 1,
    colorDescription: 'Green biomass sample.',
    generalNotes: 'Castle HS — Initial (5/6). Small growth chamber fhw109. Lights 3% white, 5% blue, 1% red.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '09:03',
    species: 'lepe_lepe',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 5.0,
    salinity: 24.4,
    colorDescription: 'Red biomass sample.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '09:04',
    species: 'ogo_manuea',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 14.8,
    salinity: 22.1,
    colorDescription: 'Green biomass sample — outdoor tumble tank.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '09:05',
    species: 'lepe_lepe',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 4.2,
    salinity: 22.1,
    colorDescription: 'Red biomass sample — outdoor tumble tank.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-06',
    time: '10:00',
    species: 'other',
    location: 'main_500gal_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 234.8,
    generalNotes:
      'Castle HS main large system: total mixed limu collected — mostly green with some red lepe lepe (baseline weigh-in for the experiment).',
    dataReliability: 'reliable',
  },

  // ── Castle HS — May 8, 2026 (Day 2) ─────────────────────────────────────────
  {
    date: '2026-05-08',
    time: '09:00',
    species: 'ogo_manuea',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 15.2,
    salinity: 28.1,
    generalNotes:
      'Day 2 (5/8). Salt crystals visible; heavy evaporation suspected — salinity rose sharply. Plan to add water to stabilize salinity.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-08',
    time: '09:01',
    species: 'lepe_lepe',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 5.5,
    salinity: 28.1,
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-08',
    time: '09:02',
    species: 'ogo_manuea',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 17.2,
    salinity: 24.4,
    generalNotes: 'Day 2 (5/8). Small chamber stable — water and salinity steady; strong growth vs initial.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-08',
    time: '09:03',
    species: 'lepe_lepe',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 5.9,
    salinity: 24.4,
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-08',
    time: '09:04',
    species: 'ogo_manuea',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 15.0,
    salinity: 20.6,
    generalNotes:
      'Day 2 (5/8). Goats damaged drain pipe — major water loss; refilled with water and salt (salinity dropped). '
      + 'Circulation off for less than a day.',
    dataReliability: 'uncertain',
  },
  {
    date: '2026-05-08',
    time: '09:05',
    species: 'lepe_lepe',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 3.7,
    salinity: 20.6,
    healthNotes: 'Red mass down — possible fragment broke off and was flushed during drainage/refill.',
    dataReliability: 'uncertain',
  },

  // ── Castle HS — May 12, 2026 (Day 6) ─────────────────────────────────────────
  {
    date: '2026-05-12',
    time: '09:00',
    species: 'ogo_manuea',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 15.6,
    salinity: 27.5,
    lightWhitePercent: 3,
    lightBluePercent: 3,
    lightRedPercent: 3,
    generalNotes:
      'Day 6 (5/12). Growing but color not improving vs prior sessions. Lights still 3% W, B, R.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-12',
    time: '09:01',
    species: 'lepe_lepe',
    location: 'fhw205_large_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 6.0,
    salinity: 27.5,
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-12',
    time: '09:02',
    species: 'ogo_manuea',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 16.3,
    salinity: 26.7,
    lightWhitePercent: 3,
    lightBluePercent: 5,
    lightRedPercent: 1,
    generalNotes: 'Day 6 (5/12). Growing; color not improving. Lights 3% W, 5% B, 1% R.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-12',
    time: '09:03',
    species: 'lepe_lepe',
    location: 'fhw109_small_growth_chamber',
    observer: OBSERVER_NAME,
    wetMassGrams: 5.4,
    salinity: 26.7,
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-12',
    time: '09:04',
    species: 'ogo_manuea',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 15.7,
    salinity: 20.4,
    colorDescription: 'Outdoor “full color” / natural light.',
    generalNotes:
      'Day 6 (5/12). ~20 ppt salinity after salt-water pickup; color looks good; some red pigment returning to green limu.',
    dataReliability: 'reliable',
  },
  {
    date: '2026-05-12',
    time: '09:05',
    species: 'lepe_lepe',
    location: 'castle_outdoor_tumble_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 3.4,
    salinity: 20.4,
    healthNotes:
      'Outdoor red mass still declining — possible low water / pump drawing air, limu shredded and drawn into pump intake.',
    dataReliability: 'uncertain',
  },
  {
    date: '2026-05-12',
    time: '10:00',
    species: 'other',
    location: 'main_500gal_tank',
    observer: OBSERVER_NAME,
    wetMassGrams: 244.4,
    generalNotes:
      'Day 6 (5/12). Outdoor large system total mixed biomass. Lost water again; pump ran with air exposure at low level. '
      + 'Picked up salt water; portable tank tipped so only ~45 gal returned — enough to bring salinity back toward prior week (~20 ppt).',
    dataReliability: 'uncertain',
  },
];

// ---------------------------------------------------------------------------
async function main() {
  console.log(`Seeding ${RECORDS.length} observation records…`);

  for (const rec of RECORDS) {
    const timestamp = new Date(`${rec.date}T${rec.time}:00`);
    const doc = {
      timestamp,
      date: rec.date,
      species: rec.species,
      location: rec.location,
      observer: rec.observer,
      enteredBy: SEED_UID,
      enteredAt: Timestamp.now(),
      ...(rec.wetMassGrams      !== undefined && { wetMassGrams:      rec.wetMassGrams }),
      ...(rec.salinity          !== undefined && { salinity:          rec.salinity }),
      ...(rec.temperature       !== undefined && { temperature:       rec.temperature, temperatureUnit: rec.temperatureUnit ?? 'F' }),
      ...(rec.ph                !== undefined && { ph:                rec.ph }),
      ...(rec.dissolvedOxygen   !== undefined && { dissolvedOxygen:   rec.dissolvedOxygen }),
      ...(rec.containerVolume   !== undefined && { containerVolume:   rec.containerVolume, containerVolumeUnit: rec.containerVolumeUnit ?? 'gallons' }),
      ...(rec.lightScheduleStart !== undefined && { lightScheduleStart: rec.lightScheduleStart }),
      ...(rec.lightScheduleEnd   !== undefined && { lightScheduleEnd:   rec.lightScheduleEnd }),
      ...(rec.lightWhitePercent !== undefined && { lightWhitePercent: rec.lightWhitePercent }),
      ...(rec.lightRedPercent   !== undefined && { lightRedPercent:   rec.lightRedPercent }),
      ...(rec.lightBluePercent  !== undefined && { lightBluePercent:  rec.lightBluePercent }),
      ...(rec.waterExchangePercent !== undefined && { waterExchangePercent: rec.waterExchangePercent }),
      ...(rec.waterExchangeSource  && { waterExchangeSource: rec.waterExchangeSource }),
      ...(rec.nutrientsAdded       && { nutrientsAdded:      rec.nutrientsAdded }),
      ...(rec.colorDescription     && { colorDescription:    rec.colorDescription }),
      ...(rec.healthNotes          && { healthNotes:         rec.healthNotes }),
      ...(rec.generalNotes         && { generalNotes:        rec.generalNotes }),
      ...(rec.sensorIssuesNoted    && { sensorIssuesNoted:   true }),
      dataReliability: rec.dataReliability ?? 'reliable',
    };

    const ref = await addDoc(collection(db, COLLECTION), doc);
    console.log(`  ✓ ${rec.date} ${rec.species} → ${ref.id}`);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
