import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Medicine } from '../models/Medicine';
import { MedicalTest } from '../models/MedicalTest';
import { Disease } from '../models/Disease';
import { Report } from '../models/Report';
import { Feedback } from '../models/Feedback';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalUsers,
      totalMedicines,
      totalTests,
      totalDiseases,
      totalReports,
      totalFeedback
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Medicine.countDocuments(),
      MedicalTest.countDocuments(),
      Disease.countDocuments(),
      Report.countDocuments(),
      Feedback.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMedicines,
        totalTests,
        totalDiseases,
        totalReports,
        totalFeedback
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      res.status(404).json({ success: false, message: 'Feedback not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkImport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { type, data } = req.body;

  if (!type || !data || !Array.isArray(data)) {
    res.status(400).json({ success: false, message: 'Please specify type (medicines, tests, or diseases) and data as an array.' });
    return;
  }

  try {
    let resultCount = 0;

    if (type === 'medicines') {
      const result = await Medicine.insertMany(data);
      resultCount = result.length;
    } else if (type === 'tests') {
      const result = await MedicalTest.insertMany(data);
      resultCount = result.length;
    } else if (type === 'diseases') {
      const result = await Disease.insertMany(data);
      resultCount = result.length;
    } else {
      res.status(450).json({ success: false, message: 'Invalid bulk import type. Must be medicines, tests, or diseases.' });
      return;
    }

    res.status(201).json({
      success: true,
      message: `Bulk import successful. Inserted ${resultCount} items into the ${type} collection.`
    });
  } catch (error) {
    next(error);
  }
};
