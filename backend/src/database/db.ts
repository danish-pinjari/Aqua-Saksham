import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance: Database | null = null;

// ==================================================
// DATABASE CONNECTION
// ==================================================

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    const dbPath = path.resolve(__dirname, '../../aquasaksham.db');

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }

  return dbInstance;
}

// ==================================================
// INITIALIZE DATABASE
// ==================================================

export async function initDatabase() {
  const db = await getDb();

  console.log('[AquaSaksham DB] Initializing database...');

  // ==================================================
  // RECEIVERS TABLE
  // ==================================================

  await db.exec(`
    CREATE TABLE IF NOT EXISTS receivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_id TEXT UNIQUE NOT NULL,
      node_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      status TEXT DEFAULT 'Online',
      api_key_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[AquaSaksham DB] Receivers table ready');

  // ==================================================
  // AUTO MIGRATION
  // Add api_key_hash if it does not exist
  // ==================================================

  try {
    const receiverCols = await db.all(
      'PRAGMA table_info(receivers)'
    );

    const hasApiKeyHash = receiverCols.some(
      (c: any) => c.name === 'api_key_hash'
    );

    if (!hasApiKeyHash) {
      await db.exec(`
        ALTER TABLE receivers
        ADD COLUMN api_key_hash TEXT
      `);

      console.log(
        '[AquaSaksham DB] Added api_key_hash column'
      );
    }
  } catch (error) {
    console.log(
      '[AquaSaksham DB] api_key_hash migration skipped'
    );
  }

  // ==================================================
  // PROTOTYPE RECEIVER CREDENTIALS
  // ==================================================

  const receiverKeys: Record<string, string> = {
    'AS-RX-001': 'AquaRx001@2026',
    'AS-RX-002': 'AquaRx002@2026'
  };

  // ==================================================
  // CREATE DEFAULT PASSWORD HASH
  // ==================================================

  const defaultPassword = '123456';

  const defaultPasswordHash =
    await bcrypt.hash(defaultPassword, 10);

  // ==================================================
  // ENSURE RECEIVER 001 EXISTS
  // ==================================================

  let receiver001 = await db.get(
    `
    SELECT *
    FROM receivers
    WHERE receiver_id = ?
    `,
    'AS-RX-001'
  );

  if (!receiver001) {
    await db.run(
      `
      INSERT INTO receivers
      (
        receiver_id,
        node_id,
        username,
        password_hash,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      'AS-RX-001',
      1,
      'Community Well 01',
      defaultPasswordHash,
      'Online'
    );

    console.log(
      '[AquaSaksham DB] Created receiver AS-RX-001'
    );
  }

  // ==================================================
  // ENSURE RECEIVER 002 EXISTS
  // ==================================================

  let receiver002 = await db.get(
    `
    SELECT *
    FROM receivers
    WHERE receiver_id = ?
    `,
    'AS-RX-002'
  );

  if (!receiver002) {
    await db.run(
      `
      INSERT INTO receivers
      (
        receiver_id,
        node_id,
        username,
        password_hash,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      'AS-RX-002',
      2,
      'Main Reservoir 02',
      defaultPasswordHash,
      'Online'
    );

    console.log(
      '[AquaSaksham DB] Created receiver AS-RX-002'
    );
  }

  // ==================================================
  // IMPORTANT:
  // CREATE / UPDATE API KEY HASHES
  // ==================================================

  for (const [receiverId, apiKey] of Object.entries(
    receiverKeys
  )) {
    const apiKeyHash = await bcrypt.hash(
      apiKey,
      10
    );

    await db.run(
      `
      UPDATE receivers
      SET api_key_hash = ?
      WHERE receiver_id = ?
      `,
      apiKeyHash,
      receiverId
    );

    console.log(
      `[AquaSaksham DB] API key configured for ${receiverId}`
    );
  }

  // ==================================================
  // VERIFY RECEIVER 001
  // ==================================================

  const verifyReceiver001 = await db.get(
    `
    SELECT
      receiver_id,
      node_id,
      username,
      status,
      api_key_hash
    FROM receivers
    WHERE receiver_id = ?
    `,
    'AS-RX-001'
  );

  if (verifyReceiver001) {
    console.log(
      '[AquaSaksham DB] Receiver AS-RX-001 verified'
    );

    console.log(
      `[AquaSaksham DB] Node ID: ${verifyReceiver001.node_id}`
    );

    console.log(
      `[AquaSaksham DB] API Key Hash: ${
        verifyReceiver001.api_key_hash
          ? 'READY'
          : 'MISSING'
      }`
    );
  }

  // ==================================================
  // SENSOR READINGS TABLE
  // ==================================================

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      receiver_id TEXT NOT NULL
        DEFAULT 'AS-RX-001',

      node_id INTEGER NOT NULL,

      ph REAL NOT NULL,

      tds REAL NOT NULL,

      turbidity REAL NOT NULL,

      battery REAL NOT NULL,

      risk INTEGER NOT NULL,

      timestamp DATETIME
        DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log(
    '[AquaSaksham DB] Sensor readings table ready'
  );

  // ==================================================
  // SENSOR READINGS MIGRATION
  // ==================================================

  try {
    const columns = await db.all(
      'PRAGMA table_info(sensor_readings)'
    );

    const hasReceiverId = columns.some(
      (c: any) => c.name === 'receiver_id'
    );

    if (!hasReceiverId) {
      await db.exec(`
        ALTER TABLE sensor_readings
        ADD COLUMN receiver_id TEXT
        NOT NULL
        DEFAULT 'AS-RX-001'
      `);

      console.log(
        '[AquaSaksham DB] Added receiver_id to sensor_readings'
      );
    }
  } catch (error) {
    console.log(
      '[AquaSaksham DB] Sensor migration skipped'
    );
  }

  // ==================================================
  // ALERTS TABLE
  // ==================================================

  await db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      receiver_id TEXT NOT NULL
        DEFAULT 'AS-RX-001',

      node_id INTEGER NOT NULL,

      type TEXT NOT NULL,

      severity TEXT NOT NULL,

      message TEXT NOT NULL,

      timestamp DATETIME
        DEFAULT CURRENT_TIMESTAMP,

      status TEXT DEFAULT 'New'
    );
  `);

  console.log(
    '[AquaSaksham DB] Alerts table ready'
  );

  // ==================================================
  // ALERTS MIGRATION
  // ==================================================

  try {
    const alertCols = await db.all(
      'PRAGMA table_info(alerts)'
    );

    const hasAlertReceiverId = alertCols.some(
      (c: any) => c.name === 'receiver_id'
    );

    if (!hasAlertReceiverId) {
      await db.exec(`
        ALTER TABLE alerts
        ADD COLUMN receiver_id TEXT
        NOT NULL
        DEFAULT 'AS-RX-001'
      `);

      console.log(
        '[AquaSaksham DB] Added receiver_id to alerts'
      );
    }
  } catch (error) {
    console.log(
      '[AquaSaksham DB] Alert migration skipped'
    );
  }

  // ==================================================
  // SETTINGS TABLE
  // ==================================================

  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,

      ph_min REAL DEFAULT 6.5,

      ph_max REAL DEFAULT 8.5,

      tds_max REAL DEFAULT 500.0,

      turbidity_max REAL DEFAULT 5.0
    );
  `);

  console.log(
    '[AquaSaksham DB] Settings table ready'
  );

  // ==================================================
  // DEFAULT SETTINGS
  // ==================================================

  const settingsCount = await db.get<{
    count: number;
  }>(
    `
    SELECT COUNT(*) AS count
    FROM settings
    `
  );

  if (
    !settingsCount ||
    settingsCount.count === 0
  ) {
    await db.run(
      `
      INSERT INTO settings
      (
        id,
        ph_min,
        ph_max,
        tds_max,
        turbidity_max
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      1,
      6.5,
      8.5,
      500.0,
      5.0
    );

    console.log(
      '[AquaSaksham DB] Default settings inserted'
    );
  }

  // ==================================================
  // DEFAULT SENSOR DATA
  // Only insert if table is empty
  // ==================================================

  const sensorCount = await db.get<{
    count: number;
  }>(
    `
    SELECT COUNT(*) AS count
    FROM sensor_readings
    `
  );

  if (
    !sensorCount ||
    sensorCount.count === 0
  ) {
    // --------------------------------------------------
    // Receiver 001 demo reading
    // --------------------------------------------------

    await db.run(
      `
      INSERT INTO sensor_readings
      (
        receiver_id,
        node_id,
        ph,
        tds,
        turbidity,
        battery,
        risk,
        timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      'AS-RX-001',
      1,
      7.50,
      370,
      3.5,
      98,
      0
    );

    // --------------------------------------------------
    // Receiver 002 demo reading
    // --------------------------------------------------

    await db.run(
      `
      INSERT INTO sensor_readings
      (
        receiver_id,
        node_id,
        ph,
        tds,
        turbidity,
        battery,
        risk,
        timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      'AS-RX-002',
      2,
      7.20,
      240,
      2.1,
      92,
      0
    );

    console.log(
      '[AquaSaksham DB] Default sensor data inserted'
    );
  }

  // ==================================================
  // FINAL DATABASE CHECK
  // ==================================================

  const finalReceiver = await db.get(
    `
    SELECT
      receiver_id,
      node_id,
      username,
      status,
      CASE
        WHEN api_key_hash IS NOT NULL
        AND api_key_hash != ''
        THEN 'READY'
        ELSE 'MISSING'
      END AS api_key_status
    FROM receivers
    WHERE receiver_id = ?
    `,
    'AS-RX-001'
  );

  console.log(
    '================================================'
  );

  console.log(
    '[AquaSaksham DB] INITIALIZATION COMPLETE'
  );

  console.log(
    `[AquaSaksham DB] Receiver ID : ${
      finalReceiver?.receiver_id
    }`
  );

  console.log(
    `[AquaSaksham DB] Node ID     : ${
      finalReceiver?.node_id
    }`
  );

  console.log(
    `[AquaSaksham DB] API Key     : ${
      finalReceiver?.api_key_status
    }`
  );

  console.log(
    '================================================'
  );
}