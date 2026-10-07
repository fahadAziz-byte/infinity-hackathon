import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const isPostgres = Boolean(
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))
);

let pgPool: pg.Pool | null = null;
let sqliteDb: Database.Database | null = null;

if (isPostgres) {
  console.log('Connecting to Neon PostgreSQL database...');
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  console.log('Using local embedded SQLite database...');
  const dbPath = path.resolve(__dirname, '../../crm.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');
}

/**
 * Universal query runner: translates ? to $1, $2, ... for Postgres
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (isPostgres && pgPool) {
    let pgSql = sql;
    let paramIndex = 1;
    // Replace '?' placeholders with $1, $2, $3 for PostgreSQL
    pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows as T[];
  } else if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params) as T[];
  }
  return [];
}

/**
 * Universal single-row query runner
 */
export async function getOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Universal run/execute query
 */
export async function execute(sql: string, params: any[] = []): Promise<void> {
  if (isPostgres && pgPool) {
    let pgSql = sql;
    let paramIndex = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);
    await pgPool.query(pgSql, params);
  } else if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    stmt.run(...params);
  }
}

/**
 * Initialize database tables
 */
export async function initDatabase() {
  if (isPostgres && pgPool) {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('ADMIN', 'MANAGER', 'AGENT')),
        specialization VARCHAR(255),
        skills TEXT
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        clientName VARCHAR(255) NOT NULL,
        description TEXT,
        managerId VARCHAR(50) NOT NULL,
        deadline VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (managerId) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(50) PRIMARY KEY,
        projectId VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigneeId VARCHAR(50) NOT NULL,
        deadline VARCHAR(20) NOT NULL,
        estimatedHours NUMERIC NOT NULL CHECK(estimatedHours > 0),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  } else if (sqliteDb) {
    sqliteDb.exec(`
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
}
