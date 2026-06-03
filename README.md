# ⚽ Football Tally Application

Welcome to the **Football Tally** application! This is a complete, full-stack application designed to track football competition match results and display a real-time, dynamic leaderboard/standings table.

## 🗂️ Project Structure

The project is split into two primary components:

*   **[`/backend`](./backend)**: A TypeScript Node.js Express server that processes submitted matches, calculates scores, and persists standings state in a JSON file.
*   **[`/frontend`](./frontend)**: A modern Next.js React client with Tailwind CSS, supporting interactive forms for match logging, text file uploads, and responsive standings display.

---

## 🚀 Quick Start (Running the App)

Follow these steps to run both the backend and frontend servers on your local machine:

### ⚙️ Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Start the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on **`http://localhost:5000`**.

### 2. Start the Frontend
1. Open a *new* terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   Open **[`http://localhost:3000`](http://localhost:3000)** in your browser to view the application.

---

## 🧪 Testing the Application

Both backend and frontend contain full unit and integration test suites:
- To test the backend: Run `npm run test` in `/backend`.
- To test the frontend: Run `npm run test` in `/frontend`.
