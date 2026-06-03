import request from 'supertest';
import fs      from 'fs';
import path    from 'path';
import app     from '../../app';

// src/__tests__/routes → __tests__ → src → backend/ (3 levels up)
const RESULTS_FILE = path.join(__dirname, '..', '..', '..', 'results.json');

beforeEach(() => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });
afterEach(()  => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });

const MATCH_LINE = 'Germany;Spain;win';

describe('Tournament API routes', () => {
  // ── GET /api/standings ────────────────────────────────────────────────────
  describe('GET /api/standings', () => {
    it('returns 200 with an empty data array when no matches submitted', async () => {
      const res = await request(app).get('/api/standings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('returns current standings after a submit', async () => {
      await request(app).post('/api/submit/string').send({ input: MATCH_LINE });
      const res = await request(app).get('/api/standings');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  // ── POST /api/submit/string ───────────────────────────────────────────────
  describe('POST /api/submit/string', () => {
    it('returns 200 and updated standings for valid input', async () => {
      const res = await request(app)
        .post('/api/submit/string')
        .send({ input: MATCH_LINE });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Results updated successfully');
      expect(res.body.data).toHaveLength(2);
    });

    it('accepts literal \\n sequences and treats them as newlines', async () => {
      const res = await request(app)
        .post('/api/submit/string')
        .send({ input: 'Germany;Spain;win\\nFrance;Germany;win' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(3);
    });

    it('returns 400 when input field is missing', async () => {
      const res = await request(app).post('/api/submit/string').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Input string is required');
    });

    it('returns 400 when input is whitespace only', async () => {
      const res = await request(app).post('/api/submit/string').send({ input: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 for malformed match lines', async () => {
      const res = await request(app)
        .post('/api/submit/string')
        .send({ input: 'BadLine' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/submit/file ─────────────────────────────────────────────────
  describe('POST /api/submit/file', () => {
    it('returns 200 when a valid file is uploaded', async () => {
      const res = await request(app)
        .post('/api/submit/file')
        .attach('file', Buffer.from(MATCH_LINE), 'matches.txt');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('File processed successfully');
      expect(res.body.data).toHaveLength(2);
    });

    it('returns 400 when no file is attached', async () => {
      const res = await request(app).post('/api/submit/file');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No file uploaded');
    });

    it('returns 400 when the uploaded file is empty', async () => {
      const res = await request(app)
        .post('/api/submit/file')
        .attach('file', Buffer.from('   '), 'empty.txt');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Uploaded file is empty');
    });

    it('returns 400 when the file contains malformed lines', async () => {
      const res = await request(app)
        .post('/api/submit/file')
        .attach('file', Buffer.from('NotAMatchLine'), 'bad.txt');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── DELETE /api/reset ─────────────────────────────────────────────────────
  describe('DELETE /api/reset', () => {
    it('returns "No standings to reset" when nothing was submitted', async () => {
      const res = await request(app).delete('/api/reset');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('No standings to reset');
    });

    it('returns "Standings reset successfully" after data has been submitted', async () => {
      await request(app).post('/api/submit/string').send({ input: MATCH_LINE });
      const res = await request(app).delete('/api/reset');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Standings reset successfully');
    });

    it('standings are empty after a reset', async () => {
      await request(app).post('/api/submit/string').send({ input: MATCH_LINE });
      await request(app).delete('/api/reset');
      const res = await request(app).get('/api/standings');
      expect(res.body.data).toEqual([]);
    });
  });

  // ── GET /api/status (health check) ───────────────────────────────────────
  describe('GET /api/status', () => {
    it('returns { status: "ok" }', async () => {
      const res = await request(app).get('/api/status');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ── GET / (root welcome route) ────────────────────────────────────────────
  describe('GET /', () => {
    it('returns the welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Welcome');
    });
  });

  // ── GET /api-docs (Swagger UI) ────────────────────────────────────────────
  describe('GET /api-docs', () => {
    it('redirects to /api-docs/', async () => {
      const res = await request(app).get('/api-docs');
      expect(res.status).toBe(301);
    });

    it('returns the Swagger UI HTML page', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('<html');
      expect(res.text).toContain('swagger');
    });
  });
});
