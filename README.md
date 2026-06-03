# ⚽ Football Tally Application

Welcome to the **Football Tally** application! This is a complete, full-stack application designed to track football competition match results and display a real-time, dynamic leaderboard/standings table.

## 🎬 Demo

> Click the badge below to watch the app in action:

[![Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-screenrec.com-blue?style=for-the-badge)](https://screenrec.com/share/Mv3a2w4ukO)

---

## 🗂️ Project Structure

The project is split into two primary components:

- **[`/backend`](./backend)**: A TypeScript Node.js Express server that processes submitted matches, calculates scores, and persists standings state in a JSON file.
- **[`/frontend`](./frontend)**: A modern Next.js React client with Tailwind CSS, supporting interactive forms for match logging, text file uploads, and responsive standings display.

---

## 🏗️ Architecture

```
football_tally_aligntech/
├── backend/                  # Express API (port 5000)
│   ├── src/
│   │   ├── models/           # Match, Team, Tournament classes
│   │   ├── services/         # Business logic + file persistence
│   │   ├── controllers/      # Request handlers
│   │   └── routes/           # API route definitions
│   └── src/swagger.json      # OpenAPI docs → /api-docs
│
└── frontend/                 # Next.js UI (port 3000)
    ├── app/                  # Next.js App Router
    ├── components/           # Header, StandingsTable, Toast, etc.
    └── lib/                  # API client + TypeScript types
```

---

## 🚀 Quick Start

### Prerequisites
[Node.js](https://nodejs.org/) v18+ required.

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
API runs on **`http://localhost:5000`** · Swagger docs at **`http://localhost:5000/api-docs`**

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[`http://localhost:3000`](http://localhost:3000)** in your browser.

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

Both suites include unit tests with full coverage.
