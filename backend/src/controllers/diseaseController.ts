import { Request, Response, NextFunction } from 'express';
import { Disease } from '../models/Disease';

const formatDiseaseByLanguage = (disease: any, lang: 'en' | 'hi' | 'te') => {
  const disObj = disease.toObject ? disease.toObject() : { ...disease };
  if (lang === 'en' || !disObj.translations?.[lang]) {
    return disObj;
  }
  const transObj = disObj.translations[lang];
  Object.keys(transObj).forEach(key => {
    if (transObj[key] && transObj[key].trim() !== '') {
      disObj[key] = transObj[key];
    }
  });
  return disObj;
};

export const getDiseases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

    const total = await Disease.countDocuments({});
    const diseases = await Disease.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const formattedDiseases = diseases.map(d => formatDiseaseByLanguage(d, lang));

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      diseases: formattedDiseases
    });
  } catch (error) {
    next(error);
  }
};

export const getDiseaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

    const disease = await Disease.findById(id);
    if (!disease) {
      res.status(404).json({ success: false, message: 'Disease not found' });
      return;
    }

    res.status(200).json({
      success: true,
      disease: formatDiseaseByLanguage(disease, lang)
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN CRUD OPERATIONS

export const createDisease = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json({ success: true, disease });
  } catch (error) {
    next(error);
  }
};

export const updateDisease = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const disease = await Disease.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!disease) {
      res.status(404).json({ success: false, message: 'Disease not found' });
      return;
    }

    res.status(200).json({ success: true, disease });
  } catch (error) {
    next(error);
  }
};

export const deleteDisease = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const disease = await Disease.findByIdAndDelete(id);

    if (!disease) {
      res.status(404).json({ success: false, message: 'Disease not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Disease deleted successfully' });
  } catch (error) {
    next(error);
  }
};
