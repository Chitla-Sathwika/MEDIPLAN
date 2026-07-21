import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/auth';
import { 
  getDashboardStats, 
  getUsers, 
  deleteUser, 
  getFeedback, 
  deleteFeedback, 
  bulkImport 
} from '../controllers/adminController';

const router = Router();

// Secure all admin routes
router.use(protect, adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/feedback', getFeedback);
router.delete('/feedback/:id', deleteFeedback);
router.post('/import', bulkImport);

export default router;
