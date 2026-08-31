import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance: Database | null = null;

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

export async function initDatabase() {
  const db = await getDb();

  // Create Receivers Table
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

  // Auto-migration: add receiver API key hash for secure device ingestion
  try {
    const receiverCols = await db.all("PRAGMA table_info(receivers)");
    const hasApiKeyHash = receiverCols.some((c: any) => c.name === 'api_key_hash');
    if (!hasApiKeyHash) {
      await db.exec("ALTER TABLE receivers ADD COLUMN api_key_hash TEXT");
    }
  } catch (e) {
    // Column already present
  }

  // Seed/migrate device API keys.
  // These are prototype keys; change them before production deployment.
  const receiverKeys: Record<string, string> = {
    'AS-RX-001': 'AquaRx001@2026',
    'AS-RX-002': 'AquaRx002@2026'
  };

  for (const [receiverId, apiKey] of Object.entries(receiverKeys)) {
    const existing = await db.get<{ api_key_hash: string | null }>(
      'SELECT api_key_hash FROM receivers WHERE receiver_id = ?',
      receiverId
    );
    if (existing && !existing.api_key_hash) {
      const hash = await bcrypt.hash(apiKey, 10);
      await db.run(
        'UPDATE receivers SET api_key_hash = ? WHERE receiver_id = ?',
        hash, receiverId
      );
    }
  }

  // Create Sensor Readings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_id TEXT NOT NULL DEFAULT 'AS-RX-001',
      node_id INTEGER NOT NULL,
      ph REAL NOT NULL,
      tds REAL NOT NULL,
      turbidity REAL NOT NULL,
      battery REAL NOT NULL,
      risk INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-migration: check if receiver_id column exists in existing table
  try {
    const columns = await db.all("PRAGMA table_info(sensor_readings)");
    const hasReceiverId = columns.some((c: any) => c.name === 'receiver_id');
    if (!hasReceiverId) {
      await db.exec("ALTER TABLE sensor_readings ADD COLUMN receiver_id TEXT NOT NULL DEFAULT 'AS-RX-001'");
    }
  } catch (e) {
    // Column already present
  }

  // Create Alerts Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_id TEXT NOT NULL DEFAULT 'AS-RX-001',
      node_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'New'
    );
  `);

  // Auto-migration: check if receiver_id column exists in alerts table
  try {
    const alertCols = await db.all("PRAGMA table_info(alerts)");
    const hasAlertReceiverId = alertCols.some((c: any) => c.name === 'receiver_id');
    if (!hasAlertReceiverId) {
      await db.exec("ALTER TABLE alerts ADD COLUMN receiver_id TEXT NOT NULL DEFAULT 'AS-RX-001'");
    }
  } catch (e) {
    // Column already present
  }

  // Create Settings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      ph_min REAL DEFAULT 6.5,
      ph_max REAL DEFAULT 8.5,
      tds_max REAL DEFAULT 500.0,
      turbidity_max REAL DEFAULT 5.0
    );
  `);

  // Seed default Settings
  const settingsCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM settings');
  if (!settingsCount || settingsCount.count === 0) {
    await db.run('INSERT INTO settings (id, ph_min, ph_max, tds_max, turbidity_max) VALUES (?, ?, ?, ?, ?)', 1, 6.5, 8.5, 500, 5);
  }

  // Seed Default Receivers if empty
  const receiverCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM receivers');
  if (!receiverCount || receiverCount.count === 0) {
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('123456', salt);

    await db.run(
      'INSERT INTO receivers (receiver_id, node_id, username, password_hash, status) VALUES (?, ?, ?, ?, ?)',
      'AS-RX-001', 1, 'Community Well 01', defaultPasswordHash, 'Online'
    );

    await db.run(
      'INSERT INTO receivers (receiver_id, node_id, username, password_hash, status) VALUES (?, ?, ?, ?, ?)',
      'AS-RX-002', 2, 'Main Reservoir 02', defaultPasswordHash, 'Online'
    );

    await db.run(
      `INSERT INTO sensor_readings (receiver_id, node_id, ph, tds, turbidity, battery, risk, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      'AS-RX-001', 1, 7.50, 370, 3.5, 98, 0
    );

    await db.run(
      `INSERT INTO sensor_readings (receiver_id, node_id, ph, tds, turbidity, battery, risk, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      'AS-RX-002', 2, 7.20, 240, 2.1, 92, 0
    );
  }
}