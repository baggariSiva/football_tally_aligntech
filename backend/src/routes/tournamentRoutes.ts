import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/tournamentController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get   ('/standings',     controller.getStandings);
router.post  ('/submit/string', controller.submitString);
router.post  ('/submit/file',   upload.single('file'), controller.submitFile);
router.delete('/reset',         controller.resetStandings);

export default router;
