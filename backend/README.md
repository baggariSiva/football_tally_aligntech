# ⚽ Football Tally Backend API

This is the backend service for the Football Tally application. It is built using Node.js, Express, TypeScript, Jest for testing, and Swagger for API documentation.

## 🛠️ Features
- Processes match results from text input or file uploads.
- Evaluates standings based on wins (3 points), losses (0 points), and matches played.
- Persists standings data to a local JSON file (`results.json`).
- Exposes interactive OpenAPI Swagger documentation.

---

## 🏃 Getting Started

### 1. Install Dependencies
Navigate to the backend directory and run:
```bash
npm install
```

### 2. Configure Environment
A default `.env` is provided. If you need to override the port, specify it there:
```env
PORT=5000
```

### 3. Run the Server
*   **Development mode** (with hot reloading):
    ```bash
    npm run dev
    ```
*   **Production mode** (compile and run):
    ```bash
    npm run start
    ```

The API will be available at **`http://localhost:5000`**.

---

## 📖 API Documentation (Swagger UI)

Interactive Swagger API docs are built into the server. When the backend is running, navigate to:
👉 **[`http://localhost:5000/api-docs`](http://localhost:5000/api-docs)**

From there, you can view the endpoint specifications and test the request routes directly from the browser.

---

## 📝 Match Input Format & Sample Files

Match logs must follow a semicolon-separated values (SSV) format containing:
`[Team 1 Name];[Team 2 Name];[result]`

Where `result` must be either:
- `win`: Team 1 won (Team 2 lost)
- `loss`: Team 1 lost (Team 2 won)

*Note: Draws are not supported.*

### 📄 Sample Input
A sample file is included at: **[`sample_matches.txt`](../sample_matches.txt)**:
```text
Germany;Spain;win
Spain;France;win
France;Germany;loss
Italy;England;win
```

---

## 💾 State Persistence (`results.json`)

To persist standings across server restarts:
- When matches are submitted or a reset is requested, the application updates/saves the state to a **`results.json`** file created at the root level of the backend folder.
- Similarly, running the Jest test suite will automatically generate and clean up `results.json` during test assertion sequences.

---

## 🧪 Running Tests

The backend uses **Jest** with `ts-jest` for unit and route integration testing.
Run the tests with:
```bash
npm run test
```
This runs the Jest test suite in-band to prevent parallel test conflicts writing to `results.json`.
