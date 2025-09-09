// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      reg_id TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attendee_id INTEGER NOT NULL,
      marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      method TEXT,
      FOREIGN KEY(attendee_id) REFERENCES attendees(id)
    )`);
  });
}

module.exports = { db, init };
