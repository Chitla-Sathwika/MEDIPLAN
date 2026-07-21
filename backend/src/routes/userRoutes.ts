import { Router } from 'express';
import { 
  getBookmarks, 
  addBookmark, 
  removeBookmark, 
  getSearchHistory, 
  addSearchHistory, 
  clearSearchHistory, 
  getNotifications, 
  markNotificationRead, 
  deleteNotification, 
  submitFeedback 
} from '../controllers/userController';
import { protect } from '../middlewares/auth';

const router = Router();

// Feedback is open, optional auth
router.post('/feedback', (req, res, next) => {
  // Try to run protect if token exists, otherwise just proceed as guest
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    protect(req, res, next).catch(next);
    return;
  }
  next();
}, submitFeedback);

// Secured user routes
router.use(protect);

// Bookmarks
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks', removeBookmark);

// Search History
router.get('/history', getSearchHistory);
router.post('/history', addSearchHistory);
router.delete('/history', clearSearchHistory);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

export default router;
