import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Setup database path inside root data directory
const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'parzio_production.db');
export const db = new Database(dbPath);

// Enable WAL (Write-Ahead Logging) for lightning fast concurrency and multi-reader throughput
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Initialize robust production schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL NOT NULL,
      save_percent INTEGER NOT NULL,
      rating REAL DEFAULT 4.9,
      reviews_count INTEGER DEFAULT 0,
      colorways INTEGER DEFAULT 40,
      sku TEXT NOT NULL UNIQUE,
      material TEXT NOT NULL,
      is_waterproof INTEGER DEFAULT 1,
      is_anti_tarnish INTEGER DEFAULT 1,
      badge TEXT,
      quote TEXT,
      image TEXT NOT NULL,
      description TEXT,
      stock INTEGER DEFAULT 250,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      pincode TEXT NOT NULL,
      rto_risk TEXT DEFAULT 'Low',
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Confirmed',
      product_name TEXT NOT NULL,
      sku TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      image TEXT,
      tag TEXT,
      courier TEXT DEFAULT 'BlueDart Air Express',
      phone_verified INTEGER DEFAULT 1,
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      order_id TEXT,
      delta INTEGER NOT NULL,
      remaining_stock INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  `);
}
