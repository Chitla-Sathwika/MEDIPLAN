import { Router } from 'express';
import { 
  getMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
} from '../controllers/medicineController';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Public lookups
router.get('/', getMedicines);
router.get('/:id', getMedicineById);

// Admin-only CRUD operations
router.post('/', protect, adminOnly, createMedicine);
router.put('/:id', protect, adminOnly, updateMedicine);
router.delete('/:id', protect, adminOnly, deleteMedicine);

export default router;
