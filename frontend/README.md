# ⚽ Football Tally Frontend Client

This is the user interface client for the Football Tally application, built with **Next.js**, **React**, and **Tailwind CSS**.

## 🛠️ Features
- **Match Submission Tab**: Type in match strings directly or upload `.txt` results files.
- **Dynamic Leaderboard**: Displays ranks, team names, matches played, wins, losses, and total points, highlighting the first-place team.
- **Hydration Safe / Extension Proof**: Suppresses root hydration errors caused by dark-mode or password manager browser extensions.
- **Instant Response Toasts**: Dispatches clean alert toasts with concurrent-safe queue timeouts (configured to 1 second auto-dismiss).

---

## 🏃 Getting Started

### 1. Install Dependencies
Navigate to the frontend directory and install the packages:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[`http://localhost:3000`](http://localhost:3000)** in your browser.

### 🔌 API Proxy / Next.js Rewrite
To prevent CORS errors, relative backend calls to `/api` are automatically proxied to the backend server (running on `http://localhost:5000/api`) via Next.js rewrites. Ensure your backend is running on port 5000.

---

## 🧪 Running Tests & Coverage

The frontend uses **Jest** with **React Testing Library (RTL)** for unit testing components, API fetches, and tab rendering states.

### Run Tests
```bash
npm run test
```
Running the test command automatically compiles and runs all test suites, and outputs a detailed **Code Coverage Report** directly to your terminal.

### Current Coverage Metrics
The test suite achieves **99.58%** statement and line coverage, thoroughly covering component actions, API mocks, and failure boundaries:

```text
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |   99.58 |    85.71 |   90.47 |   99.58 |                   
 app                 |   98.91 |    82.92 |   85.71 |   98.91 |                   
  page.tsx           |   98.91 |    82.92 |   85.71 |   98.91 | 26-27             
 components          |     100 |     92.3 |      90 |     100 |                   
  FileUpload.tsx     |     100 |     87.5 |      75 |     100 |                   
  Header.tsx         |     100 |      100 |     100 |     100 |                   
  StandingsTable.tsx |     100 |      100 |     100 |     100 |                   
  StringInput.tsx    |     100 |    85.71 |     100 |     100 |                   
  Toast.tsx          |     100 |      100 |     100 |     100 |                   
 lib                 |     100 |       80 |     100 |     100 |                   
  api.ts             |     100 |       80 |     100 |     100 |                   
---------------------|---------|----------|---------|---------|-------------------
```
