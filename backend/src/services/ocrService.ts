import Tesseract from 'tesseract.js';
import { Medicine } from '../models/Medicine';
import { MedicalTest } from '../models/MedicalTest';
import { Disease } from '../models/Disease';

interface IDetectedItems {
  medicines: string[];
  tests: string[];
  diseases: string[];
}

export const extractTextFromImage = async (filePath: string): Promise<string> => {
  try {
    console.log(`Starting OCR on file: ${filePath}`);
    const result = await Tesseract.recognize(filePath, 'eng');
    console.log('OCR extraction successful.');
    return result.data.text;
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw new Error('Failed to extract text from the uploaded image.');
  }
};

export const matchKeywordsInText = async (text: string): Promise<IDetectedItems> => {
  const lowercaseText = text.toLowerCase();
  
  // Retrieve all items from DB for scanning
  const [allMedicines, allTests, allDiseases] = await Promise.all([
    Medicine.find({}, '_id name genericName brandName keywords'),
    MedicalTest.find({}, '_id name keywords'),
    Disease.find({}, '_id name keywords')
  ]);

  const detectedMedicines: string[] = [];
  const detectedTests: string[] = [];
  const detectedDiseases: string[] = [];

  // 1. Scan Medicines
  allMedicines.forEach(med => {
    const nameMatch = lowercaseText.includes(med.name.toLowerCase());
    const genericMatch = lowercaseText.includes(med.genericName.toLowerCase());
    const brandMatch = med.brandName.split(',').some(brand => 
      lowercaseText.includes(brand.trim().toLowerCase())
    );
    const keywordMatch = med.keywords.some(kw => lowercaseText.includes(kw.toLowerCase()));

    if (nameMatch || genericMatch || brandMatch || keywordMatch) {
      detectedMedicines.push(med._id.toString());
    }
  });

  // 2. Scan Tests
  allTests.forEach(test => {
    const nameMatch = lowercaseText.includes(test.name.toLowerCase());
    const keywordMatch = test.keywords.some(kw => lowercaseText.includes(kw.toLowerCase()));

    if (nameMatch || keywordMatch) {
      detectedTests.push(test._id.toString());
    }
  });

  // 3. Scan Diseases
  allDiseases.forEach(disease => {
    const nameMatch = lowercaseText.includes(disease.name.toLowerCase());
    const keywordMatch = disease.keywords.some(kw => lowercaseText.includes(kw.toLowerCase()));

    if (nameMatch || keywordMatch) {
      detectedDiseases.push(disease._id.toString());
    }
  });

  return {
    medicines: detectedMedicines,
    tests: detectedTests,
    diseases: detectedDiseases
  };
};
