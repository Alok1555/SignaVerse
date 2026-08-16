import { Router } from 'express';
import authRoutes from './authRoutes';
import worldRoutes from './worldRoutes';
import practiceRoutes from './practiceRoutes';
import gamificationRoutes from './gamificationRoutes';
import teacherRoutes from './teacherRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/worlds', worldRoutes);
router.use('/practice', practiceRoutes);
router.use('/teacher', teacherRoutes);
router.use('/', gamificationRoutes); // Mount achievements, rewards, challenges, etc. at root of API

export default router;
