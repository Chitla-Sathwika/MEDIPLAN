import { Request, Response, NextFunction } from 'express';
import { Medicine } from '../models/Medicine';
import { MedicalTest } from '../models/MedicalTest';
import { Disease } from '../models/Disease';

// Helper to translate search items dynamically before sending to UI
const formatItemByLanguage = (item: any, lang: 'en' | 'hi' | 'te') => {
  const itemObj = item.toObject ? item.toObject() : { ...item };
  if (lang === 'en' || !itemObj.translations?.[lang]) {
    return itemObj;
  }
  const transObj = itemObj.translations[lang];
  Object.keys(transObj).forEach(key => {
    if (transObj[key] && transObj[key].trim() !== '') {
      itemObj[key] = transObj[key];
    }
  });
  return itemObj;
};

export const searchAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const query = (req.query.q as string || '').trim();
  const lang = (req.query.lang as 'en' | 'hi' | 'te') || 'en';

  if (!query) {
    res.status(200).json({ success: true, results: [], suggestions: [] });
    return;
  }

  try {
    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');

    // Run parallel regex queries on all collections
    const [medicines, tests, diseases] = await Promise.all([
      Medicine.find({
        $or: [
          { name: regex },
          { genericName: regex },
          { brandName: regex },
          { category: regex },
          { keywords: regex },
          { 'translations.hi.name': regex },
          { 'translations.te.name': regex }
        ]
      }),
      MedicalTest.find({
        $or: [
          { name: regex },
          { category: regex },
          { keywords: regex },
          { 'translations.hi.name': regex },
          { 'translations.te.name': regex }
        ]
      }),
      Disease.find({
        $or: [
          { name: regex },
          { keywords: regex },
          { 'translations.hi.name': regex },
          { 'translations.te.name': regex }
        ]
      })
    ]);

    const results: any[] = [];

    // Calculate score & package results
    medicines.forEach(med => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      
      if (med.name.toLowerCase() === lowerQuery || med.brandName.toLowerCase().includes(lowerQuery)) score += 10;
      else if (med.name.toLowerCase().includes(lowerQuery)) score += 8;
      else if (med.keywords.some(k => k.toLowerCase() === lowerQuery)) score += 6;
      else score += 4;

      results.push({
        type: 'medicine',
        score,
        data: formatItemByLanguage(med, lang)
      });
    });

    tests.forEach(test => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      
      if (test.name.toLowerCase() === lowerQuery) score += 10;
      else if (test.name.toLowerCase().includes(lowerQuery)) score += 8;
      else if (test.keywords.some(k => k.toLowerCase() === lowerQuery)) score += 6;
      else score += 4;

      results.push({
        type: 'test',
        score,
        data: formatItemByLanguage(test, lang)
      });
    });

    diseases.forEach(dis => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      
      if (dis.name.toLowerCase() === lowerQuery) score += 10;
      else if (dis.name.toLowerCase().includes(lowerQuery)) score += 8;
      else if (dis.keywords.some(k => k.toLowerCase() === lowerQuery)) score += 6;
      else score += 4;

      results.push({
        type: 'disease',
        score,
        data: formatItemByLanguage(dis, lang)
      });
    });

    // Sort results by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Dynamic suggestions builder based on top names
    const suggestions = results.slice(0, 5).map(r => r.data.name);

    res.status(200).json({
      success: true,
      count: results.length,
      results,
      suggestions
    });
  } catch (error) {
    next(error);
  }
};
