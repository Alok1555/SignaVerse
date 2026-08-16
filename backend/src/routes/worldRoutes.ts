import { Router } from 'express';
import { getWorlds, getWorld, getLesson } from '../controllers/worldController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWorlds);
router.get('/:id', authenticate, getWorld);
router.get('/lessons/:id', authenticate, getLesson);

export default router;
