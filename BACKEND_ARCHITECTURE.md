# 💎 PARZIO Demi-Fine — Production Backend Architecture & Client Handover

## 🚀 Overview
PARZIO Demi-Fine Jewellery application features an enterprise-grade, high-concurrency Node.js/Express backend with SQLite WAL (Write-Ahead Logging) database architecture. It is built to seamlessly withstand high-volume flash sales (e.g. ₹99 drops) without overselling, deadlocks, or duplicate orders.

---

## 🛡️ Key Enterprise Safeguards
1. **ACID Transactional Concurrency**:
   - Order placement executes inside a synchronous transaction (`db.transaction()`).
   - Checks inventory stock before reservation; if stock is insufficient, transaction aborts instantly without data corruption.
2. **Idempotency Keys Shield**:
   - Every checkout payload supports an `x-idempotency-key`.
   - If a customer repeatedly taps "Place Order" or network lags, the server replays the existing confirmed order instead of double-charging or creating duplicate shipments.
3. **Bot & DDoS Rate Limiting**:
   - `express-rate-limit` guards the order endpoint (`/api/orders`) allowing maximum 30 requests/min per IP to prevent bot scraping or fake order surges.
4. **Zero-Downtime Multi-Reader Throughput**:
   - SQLite WAL (Write-Ahead Logging) mode allows simultaneous fast reads while orders are written to disk.
   - 100% production-ready locally and easily migratable to PostgreSQL/Supabase with zero logic changes.

---

## 📡 API Endpoints Reference

### Customer Storefront
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server uptime, latency & database health |
| `GET` | `/api/products` | All jewelry products catalog (supports `?category=RINGS`) |
| `POST` | `/api/orders` | Idempotent, high-concurrency order placement |
| `GET` | `/api/orders/:id` | Live tracking status & BlueDart courier telemetry |

### Atelier Operations (Admin)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/orders` | Stream of all customer orders with status & search filter |
| `PATCH` | `/api/admin/orders/:id/status`| Update status (`Dispatched`, `Delivered`, `RTO`) |
| `GET` | `/api/admin/analytics` | Real-time GMV, Order count, & low-stock alerts |

---

## 🏃 Running the Full-Stack Application

### 1. Start the Production Backend (Port 5000):
```bash
npm run server
```

### 2. Start the Frontend Storefront (Port 3000):
```bash
npm run dev
```

Both frontend and backend are fully wired with live fallback resilience so the application never breaks even if offline.
