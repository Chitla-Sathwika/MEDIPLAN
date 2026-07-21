import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Report } from '../models/Report';
import { extractTextFromImage, matchKeywordsInText } from '../services/ocrService';
import { explainReportWithAI } from '../services/geminiService';

export const uploadAndAnalyzeReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const reportType = req.body.reportType as 'prescription' | 'lab_report' | 'bill';
    const lang = (req.body.language as 'en' | 'hi' | 'te') || req.user.language || 'en';

    if (!reportType) {
      res.status(400).json({ success: false, message: 'Please specify a reportType (prescription, lab_report, or bill)' });
      return;
    }

    let extractedText = req.body.text as string;
    let imageUrl = '';

    // If an image file is uploaded, run OCR
    if (req.file) {
      console.log(`Processing uploaded file: ${req.file.originalname}`);
      imageUrl = `/uploads/${req.file.filename}`; // Mock URL path
      extractedText = await extractTextFromImage(req.file.path);
    }

    if (!extractedText || extractedText.trim() === '') {
      res.status(400).json({ success: false, message: 'Could not extract text. Please ensure image contains clear medical text or upload a different image.' });
      return;
    }

    // 1. Mapped database scan to identify keywords
    console.log('Scanning database for matching keywords...');
    const detected = await matchKeywordsInText(extractedText);

    // 2. Generate AI Explanation using Gemini
    console.log(`Requesting Gemini AI explanation in language: ${lang}`);
    const aiExplanation = await explainReportWithAI(extractedText, reportType, lang);

    // 3. Save Report to Database
    const report = await Report.create({
      userId: req.user._id,
      imageUrl,
      extractedText,
      reportType,
      detectedMedicines: detected.medicines,
      detectedTests: detected.tests,
      detectedDiseases: detected.diseases,
      aiExplanation
    });

    // 4. Retrieve and populate report details to send back to client
    const populatedReport = await Report.findById(report._id)
      .populate('detectedMedicines')
      .populate('detectedTests')
      .populate('detectedDiseases');

    res.status(201).json({
      success: true,
      report: populatedReport
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const reports = await Report.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('detectedMedicines')
      .populate('detectedTests')
      .populate('detectedDiseases');

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('detectedMedicines')
      .populate('detectedTests')
      .populate('detectedDiseases');

    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
};
