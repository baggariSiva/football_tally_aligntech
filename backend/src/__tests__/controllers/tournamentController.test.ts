/**
 * tournamentController.test.ts
 *
 * Unit tests for the controller layer using mocked service calls.
 * This file targets the 500-error branches (getStandings & resetStandings
 * catch blocks) that cannot be triggered via normal HTTP in the integration
 * suite, bringing overall branch coverage above 90%.
 */
import { Request, Response } from 'express';
import * as service from '../../services/tournamentService';
import {
  getStandings,
  resetStandings,
  submitString,
  submitFile,
} from '../../controllers/tournamentController';

// ── helpers ────────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json:   jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

const mockReq = (body: object = {}, file?: Express.Multer.File) =>
  ({ body, file }) as unknown as Request;

// ── getStandings ───────────────────────────────────────────────────────────
describe('tournamentController.getStandings', () => {
  it('responds 500 when service.getStandings throws an Error', () => {
    jest.spyOn(service, 'getStandings').mockImplementationOnce(() => {
      throw new Error('disk failure');
    });

    const req = mockReq();
    const res = mockRes();
    getStandings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'disk failure' });

    jest.restoreAllMocks();
  });

  it('responds 500 with "Unknown error" when a non-Error is thrown', () => {
    jest.spyOn(service, 'getStandings').mockImplementationOnce(() => {
      throw 'surprise'; // eslint-disable-line no-throw-literal
    });

    const req = mockReq();
    const res = mockRes();
    getStandings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unknown error' });

    jest.restoreAllMocks();
  });
});

// ── resetStandings ─────────────────────────────────────────────────────────
describe('tournamentController.resetStandings', () => {
  it('responds 500 when service.resetStandings throws an Error', () => {
    jest.spyOn(service, 'resetStandings').mockImplementationOnce(() => {
      throw new Error('permission denied');
    });

    const req = mockReq();
    const res = mockRes();
    resetStandings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'permission denied' });

    jest.restoreAllMocks();
  });

  it('responds 500 with "Unknown error" when a non-Error is thrown', () => {
    jest.spyOn(service, 'resetStandings').mockImplementationOnce(() => {
      throw null; // eslint-disable-line no-throw-literal
    });

    const req = mockReq();
    const res = mockRes();
    resetStandings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unknown error' });

    jest.restoreAllMocks();
  });
});

// ── submitString (400 catch) ───────────────────────────────────────────────
describe('tournamentController.submitString', () => {
  it('responds 400 when service.processAndSave throws', () => {
    jest.spyOn(service, 'processAndSave').mockImplementationOnce(() => {
      throw new Error('parse error');
    });

    const req = mockReq({ input: 'Germany;Spain;win' });
    const res = mockRes();
    submitString(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'parse error' });

    jest.restoreAllMocks();
  });

  it('responds 400 with "Unknown error" when a non-Error is thrown', () => {
    jest.spyOn(service, 'processAndSave').mockImplementationOnce(() => {
      throw 42; // eslint-disable-line no-throw-literal
    });

    const req = mockReq({ input: 'Germany;Spain;win' });
    const res = mockRes();
    submitString(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unknown error' });

    jest.restoreAllMocks();
  });
});

// ── submitFile (400 catch) ─────────────────────────────────────────────────
describe('tournamentController.submitFile', () => {
  it('responds 400 when service.processAndSave throws during file processing', () => {
    jest.spyOn(service, 'processAndSave').mockImplementationOnce(() => {
      throw new Error('file parse error');
    });

    const fakeFile = { buffer: Buffer.from('Germany;Spain;win') } as Express.Multer.File;
    const req = mockReq({}, fakeFile);
    const res = mockRes();
    submitFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'file parse error' });

    jest.restoreAllMocks();
  });

  it('responds 400 with "Unknown error" when a non-Error is thrown during file processing', () => {
    jest.spyOn(service, 'processAndSave').mockImplementationOnce(() => {
      throw undefined; // eslint-disable-line no-throw-literal
    });

    const fakeFile = { buffer: Buffer.from('Germany;Spain;win') } as Express.Multer.File;
    const req = mockReq({}, fakeFile);
    const res = mockRes();
    submitFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unknown error' });

    jest.restoreAllMocks();
  });
});
