import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path inside server directory
const dbPath = path.resolve(__dirname, '../../crm.db');
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'MANAGER', 'AGENT')),
      specialization TEXT,
      skills TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      clientName TEXT NOT NULL,
      description TEXT,
      managerId TEXT NOT NULL,
      deadline TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (managerId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigneeId TEXT NOT NULL,
      deadline TEXT NOT NULL,
      estimatedHours REAL NOT NULL CHECK(estimatedHours > 0),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
