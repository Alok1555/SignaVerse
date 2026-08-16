import { Router } from 'express';
import {
  getAchievements,
  getRewards,
  getLeaderboard,
  getTodayChallenge,
  completeChallenge,
  getProgress,
} from '../controllers/gamificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/achievements', authenticate, getAchievements);
router.get('/rewards', authenticate, getRewards);
router.get('/challenges/today', authenticate, getTodayChallenge);
router.post('/challenges/today/complete', authenticate, completeChallenge);
router.get('/leaderboard', authenticate, getLeaderboard);
router.get('/progress', authenticate, getProgress);

export default router;
