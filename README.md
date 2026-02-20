# 🏦 KodBank — Ultra-Premium Banking Simulation

A high-fidelity, full-stack banking simulation featuring JWT cookie authentication, Aiven PostgreSQL, and a stunning "Hacker/Terminal" aesthetic.

---

## ✨ Features

- 🔒 **Secure Auth**: JWT stored in `HttpOnly` cookies with database-level session synchronization via `BankUserJwt` table.
- 💸 **Atomic Transactions**: Fund transfers implemented using SQL transactions (`BEGIN/COMMIT/ROLLBACK`) for 100% data integrity.
- 📡 **Real-time Monitoring**: Live Database Snapshot and System Terminal logs built directly into the UI.
- 🎨 **Rich Aesthetic**: Custom dark theme with scanlines, glowing monocytes, and `lucide-react` iconography.
- ☁️ **Cloud Scale**: Optimized for Aiven PostgreSQL with automatic SSL handshake handling.

---

## 📁 Project Structure

```text
kodbank/
├── backend/
│   ├── server.js       ← Express API Logic
│   ├── db.js           ← Aiven PSQL Connection + Global TLS Handling
│   └── .env.example    ← Environment Template
└── frontend/
    ├── src/
    │   ├── App.jsx     ← Integrated React UI with Terminal Engine
    │   └── index.js
    └── public/
        └── index.html  ← Monospace Font Injection
```

---

## 🚀 Quick Start

### 1. Database Setup
1. Provision a PostgreSQL service on [Aiven.io](https://console.aiven.io).
2. Copy the **Service URI**.

### 2. Backend Initialization
```bash
cd backend
cp .env.example .env
# Edit .env and paste your DATABASE_URL
npm install
npm run dev
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm start
```

---

## 🔐 API Reference

| Method | Route           | Description                   |
|--------|-----------------|-------------------------------|
| POST   | `/api/register` | Create account + initial credit|
| POST   | `/api/login`    | Initialize secure session     |
| GET    | `/api/me`       | Verify active JWT session     |
| GET    | `/api/balance`  | Sync account ledger           |
| POST   | `/api/transfer` | Execute fund migration        |
| GET    | `/api/snapshot` | Pull live DB state            |

---

## 🛠 Tech Stack

- **Frontend**: React (Hooks, Context), Axios, Lucide Icons.
- **Backend**: Node.js, Express, JWT, Bcrypt.
- **Database**: PostgreSQL (Aiven Cloud).
- **Design**: Vanilla CSS, Monospace Engineering, CRT Scanline FX.

---

*Build by Antigravity AI for Secure Simulation Research.*
