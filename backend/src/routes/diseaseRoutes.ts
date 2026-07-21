import { Router } from 'express';
import { 
  getDiseases, 
  getDiseaseById, 
  createDisease, 
  updateDisease, 
  deleteDisease 
} from '../controllers/diseaseController';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Public lookups
router.get('/', getDiseases);
router.get('/:id', getDiseaseById);

// Admin-only CRUD operations
router.post('/', protect, adminOnly, createDisease);
router.put('/:id', protect, adminOnly, updateDisease);
router.delete('/:id', protect, adminOnly, deleteDisease);

export default router;
