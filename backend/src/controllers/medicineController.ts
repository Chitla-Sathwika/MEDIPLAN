import { Request, Response, NextFunction } from 'express';
import { Medicine } from '../models/Medicine';

const formatMedicineByLanguage = (medicine: any, lang: 'en' | 'hi' | 'te') => {
  const medObj = medicine.toObject ? medicine.toObject() : { ...medicine };
  if (lang === 'en' || !medObj.translations?.[lang]) {
    return medObj;
  }
  const transObj = medObj.translations[lang];
  Object.keys(transObj).forEach(key => {
    if (transObj[key] && transObj[key].trim() !== '') {
      medObj[key] = transObj[key];
    }
  });
  return medObj;
};

export const getMedicines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const total = await Medicine.countDocuments(filter);
    const medicines = await Medicine.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const formattedMedicines = medicines.map(m => formatMedicineByLanguage(m, lang));

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      medicines: formattedMedicines
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }

    res.status(200).json({
      success: true,
      medicine: formatMedicineByLanguage(medicine, lang)
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN CRUD OPERATIONS

export const createMedicine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }

    res.status(200).json({ success: true, medicine });
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    next(error);
  }
};
