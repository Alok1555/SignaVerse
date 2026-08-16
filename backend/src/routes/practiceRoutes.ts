import { Router } from 'express';
import { startSession, submitResult } from '../controllers/practiceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/start', authenticate, startSession);
router.post('/result', authenticate, submitResult);

export default router;
