import { Router, Request, Response } from 'express';
import tournamentRoutes from './tournamentRoutes';

const router = Router();

// Health check
router.get('/status', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mount feature routers
router.use(tournamentRoutes);

export default router;
