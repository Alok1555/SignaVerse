import { Router } from 'express';
import { getStudents, getStudentProgress } from '../controllers/teacherController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply auth filters to all teacher routes: authenticated, and must be TEACHER or ADMIN
router.use(authenticate);
router.use(authorize(['TEACHER', 'ADMIN']));

router.get('/students', getStudents);
router.get('/students/:id/progress', getStudentProgress);

export default router;
