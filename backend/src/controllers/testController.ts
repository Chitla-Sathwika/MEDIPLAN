import { Request, Response, NextFunction } from 'express';
import { MedicalTest } from '../models/MedicalTest';

const formatTestByLanguage = (test: any, lang: 'en' | 'hi' | 'te') => {
  const testObj = test.toObject ? test.toObject() : { ...test };
  if (lang === 'en' || !testObj.translations?.[lang]) {
    return testObj;
  }
  const transObj = testObj.translations[lang];
  Object.keys(transObj).forEach(key => {
    if (transObj[key] && transObj[key].trim() !== '') {
      testObj[key] = transObj[key];
    }
  });
  return testObj;
};

export const getTests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

    const filter: any = {};
    if (category) {
      filter.category = category;
    }

    const total = await MedicalTest.countDocuments(filter);
    const tests = await MedicalTest.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const formattedTests = tests.map(t => formatTestByLanguage(t, lang));

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      tests: formattedTests
    });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

    const test = await MedicalTest.findById(id);
    if (!test) {
      res.status(404).json({ success: false, message: 'Medical test not found' });
      return;
    }

    res.status(200).json({
      success: true,
      test: formatTestByLanguage(test, lang)
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN CRUD OPERATIONS

export const createTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const test = await MedicalTest.create(req.body);
    res.status(201).json({ success: true, test });
  } catch (error) {
    next(error);
  }
};

export const updateTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const test = await MedicalTest.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!test) {
      res.status(404).json({ success: false, message: 'Medical test not found' });
      return;
    }

    res.status(200).json({ success: true, test });
  } catch (error) {
    next(error);
  }
};

export const deleteTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const test = await MedicalTest.findByIdAndDelete(id);

    if (!test) {
      res.status(404).json({ success: false, message: 'Medical test not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Medical test deleted successfully' });
  } catch (error) {
    next(error);
  }
};
