const Database = require("better-sqlite3");
const path = require("path");

// Create database file inside the database folder
const dbPath = path.join(__dirname, "univoice.db");

const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

console.log("UniVoice SQLite database connected!");

// Create database tables
const fs = require("fs");

const schema = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);

db.exec(schema);

console.log(" Database tables created successfully!");
module.exports = db;