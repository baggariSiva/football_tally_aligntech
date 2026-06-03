import { Request, Response } from 'express';
import * as service from '../services/tournamentService';

export const getStandings = (_req: Request, res: Response): void => {
  try {
    const standings = service.getStandings();
    res.json({ success: true, data: standings });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
};

export const submitString = (req: Request, res: Response): void => {
  try {
    const { input } = req.body as { input?: string };
    if (!input || !input.trim()) {
      res.status(400).json({ success: false, message: 'Input string is required' });
      return;
    }

    // Allow callers to pass literal \n sequences as well as real newlines.
    const standings = service.processAndSave(input.replace(/\\n/g, '\n'));
    res.json({ success: true, message: 'Results updated successfully', data: standings });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ success: false, message });
  }
};

export const submitFile = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const input = req.file.buffer.toString('utf-8');
    if (!input.trim()) {
      res.status(400).json({ success: false, message: 'Uploaded file is empty' });
      return;
    }

    const standings = service.processAndSave(input);
    res.json({ success: true, message: 'File processed successfully', data: standings });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ success: false, message });
  }
};

export const resetStandings = (_req: Request, res: Response): void => {
  try {
    const wasReset = service.resetStandings();
    res.json({
      success: true,
      message: wasReset ? 'Standings reset successfully' : 'No standings to reset',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
};
