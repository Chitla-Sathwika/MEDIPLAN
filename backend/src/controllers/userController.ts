import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Bookmark } from '../models/Bookmark';
import { SearchHistory } from '../models/SearchHistory';
import { Notification } from '../models/Notification';
import { Feedback } from '../models/Feedback';
import { Medicine } from '../models/Medicine';
import { MedicalTest } from '../models/MedicalTest';
import { Disease } from '../models/Disease';

// ==========================================
// BOOKMARKS
// ==========================================

export const getBookmarks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Performance-optimized batch resolution of bookmark details
    const medicineIds = bookmarks.filter(b => b.itemType === 'medicine').map(b => b.itemId);
    const testIds = bookmarks.filter(b => b.itemType === 'test').map(b => b.itemId);
    const diseaseIds = bookmarks.filter(b => b.itemType === 'disease').map(b => b.itemId);

    const [medicines, tests, diseases] = await Promise.all([
      Medicine.find({ _id: { $in: medicineIds } }),
      MedicalTest.find({ _id: { $in: testIds } }),
      Disease.find({ _id: { $in: diseaseIds } })
    ]);

    const medMap = new Map(medicines.map(m => [m._id.toString(), m]));
    const testMap = new Map(tests.map(t => [t._id.toString(), t]));
    const disMap = new Map(diseases.map(d => [d._id.toString(), d]));

    const populatedBookmarks = bookmarks.map(b => {
      let itemDetails = null;
      const key = b.itemId.toString();
      if (b.itemType === 'medicine') itemDetails = medMap.get(key) || null;
      if (b.itemType === 'test') itemDetails = testMap.get(key) || null;
      if (b.itemType === 'disease') itemDetails = disMap.get(key) || null;

      return {
        _id: b._id,
        itemType: b.itemType,
        itemId: b.itemId,
        createdAt: b.createdAt,
        itemDetails
      };
    }).filter(b => b.itemDetails !== null); // Filter out any deleted records

    res.status(200).json({ success: true, count: populatedBookmarks.length, bookmarks: populatedBookmarks });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      res.status(400).json({ success: false, message: 'Please provide itemType and itemId' });
      return;
    }

    // Verify item exists
    let itemExists = false;
    if (itemType === 'medicine') itemExists = !!(await Medicine.findById(itemId));
    else if (itemType === 'test') itemExists = !!(await MedicalTest.findById(itemId));
    else if (itemType === 'disease') itemExists = !!(await Disease.findById(itemId));

    if (!itemExists) {
      res.status(404).json({ success: false, message: `Item of type ${itemType} with ID ${itemId} not found` });
      return;
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId: req.user._id, itemType, itemId },
      { userId: req.user._id, itemType, itemId },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, bookmark });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      res.status(400).json({ success: false, message: 'Please provide itemType and itemId' });
      return;
    }

    await Bookmark.deleteOne({ userId: req.user._id, itemType, itemId });
    res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SEARCH HISTORY
// ==========================================

export const getSearchHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

export const addSearchHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { query } = req.body;
    if (!query || !query.trim()) {
      res.status(400).json({ success: false, message: 'Please provide a search query' });
      return;
    }

    // Keep history clean by removing existing identical query for this user before pushing a new one
    await SearchHistory.deleteMany({ userId: req.user._id, query: query.trim() });
    
    const historyItem = await SearchHistory.create({
      userId: req.user._id,
      query: query.trim()
    });

    res.status(201).json({ success: true, historyItem });
  } catch (error) {
    next(error);
  }
};

export const clearSearchHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    await SearchHistory.deleteMany({ userId: req.user._id });
    res.status(200).json({ success: true, message: 'Search history cleared successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const result = await Notification.deleteOne({ _id: id, userId: req.user._id });

    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// FEEDBACK
// ==========================================

export const submitFeedback = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, rating, message } = req.body;
    if (!name || !email || !rating || !message) {
      res.status(400).json({ success: false, message: 'Please provide name, email, rating, and message' });
      return;
    }

    const feedback = await Feedback.create({
      userId: req.user?._id || undefined,
      name,
      email,
      rating,
      message
    });

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};
