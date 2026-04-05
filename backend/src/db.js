import Database from "better-sqlite3";

const db = new Database(":memory:");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE event_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK(duration_minutes >= 1)
  );

  CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export default db;
