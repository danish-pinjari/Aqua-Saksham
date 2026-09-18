import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  // Render Persistent / Dynamic Global Store Path
  const dbPath = process.env.RENDER
    ? '/tmp/aquasaksham.sqlite'
    : path.resolve(__dirname, '../../aquasaksham.sqlite');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable WAL mode for continuous high-speed reads/writes
  await dbInstance.exec(`PRAGMA journal_mode = WAL;`);

  // Initialize Schema
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS receivers (
      receiver_id TEXT PRIMARY KEY,
      node_id INTEGER DEFAULT 1,
      username TEXT,
      password_hash TEXT,
      status TEXT DEFAULT 'Online'
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_id TEXT NOT NULL,
      node_id INTEGER DEFAULT 1,
      ph REAL,
      tds REAL,
      turbidity REAL,
      battery REAL,
      risk INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_id TEXT NOT NULL,
      node_id INTEGER DEFAULT 1,
      type TEXT,
      severity TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'New'
    );
  `);

  return dbInstance;
}

// Alias function so server.ts imports work cleanly
export async function initDatabase(): Promise<Database> {
  return await getDb();
}