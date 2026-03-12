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
