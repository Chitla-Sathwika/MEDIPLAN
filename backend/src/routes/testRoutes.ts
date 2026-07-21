import { Router } from 'express';
import { 
  getTests, 
  getTestById, 
  createTest, 
  updateTest, 
  deleteTest 
} from '../controllers/testController';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Public lookups
router.get('/', getTests);
router.get('/:id', getTestById);

// Admin-only CRUD operations
router.post('/', protect, adminOnly, createTest);
router.put('/:id', protect, adminOnly, updateTest);
router.delete('/:id', protect, adminOnly, deleteTest);

export default router;
