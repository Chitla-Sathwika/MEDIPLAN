import { Router } from 'express';
import { register, login, getProfile, updateProfile, forgotPassword } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
