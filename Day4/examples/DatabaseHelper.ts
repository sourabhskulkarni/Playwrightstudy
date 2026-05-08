import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class DatabaseHelper {
  private db: sqlite3.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new sqlite3.Database(dbPath);
    this.initTables();
  }

  private initTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        flight_id TEXT NOT NULL,
        from_city TEXT NOT NULL,
        to_city TEXT NOT NULL,
        departure_date DATE NOT NULL,
        return_date DATE,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    this.db.run(createUsersTable);
    this.db.run(createBookingsTable);
  }

  async insertUser(user: { name: string; email: string; phone: string }) {
    const sql = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      this.db.run(sql, [user.name, user.email, user.phone], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  async getUserByEmail(email: string) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return new Promise((resolve, reject) => {
      this.db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async insertBooking(booking: {
    user_id: number;
    flight_id: string;
    from_city: string;
    to_city: string;
    departure_date: string;
    return_date?: string;
  }) {
    const sql = `
      INSERT INTO bookings (user_id, flight_id, from_city, to_city, departure_date, return_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        booking.user_id,
        booking.flight_id,
        booking.from_city,
        booking.to_city,
        booking.departure_date,
        booking.return_date
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  async getBookingsByUserId(userId: number) {
    const sql = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      this.db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async updateBookingStatus(bookingId: number, status: string) {
    const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      this.db.run(sql, [status, bookingId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}