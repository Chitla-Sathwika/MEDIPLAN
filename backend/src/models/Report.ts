import { Schema, model, Document } from 'mongoose';

export interface IAIExplanation {
  meaning: string;
  purpose: string;
  warnings: string;
  abnormalValues: string;
  lifestyleAdvice: string;
  disclaimer: string;
  language: 'en' | 'hi' | 'te';
}

export interface IReport extends Document {
  userId: Schema.Types.ObjectId;
  imageUrl?: string;
  extractedText: string;
  reportType: 'prescription' | 'lab_report' | 'bill';
  detectedMedicines: Schema.Types.ObjectId[];
  detectedTests: Schema.Types.ObjectId[];
  detectedDiseases: Schema.Types.ObjectId[];
  aiExplanation?: IAIExplanation;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String },
    extractedText: { type: String, required: true },
    reportType: { type: String, enum: ['prescription', 'lab_report', 'bill'], required: true },
    detectedMedicines: [{ type: Schema.Types.ObjectId, ref: 'Medicine' }],
    detectedTests: [{ type: Schema.Types.ObjectId, ref: 'MedicalTest' }],
    detectedDiseases: [{ type: Schema.Types.ObjectId, ref: 'Disease' }],
    aiExplanation: {
      meaning: String,
      purpose: String,
      warnings: String,
      abnormalValues: String,
      lifestyleAdvice: String,
      disclaimer: String,
      language: { type: String, enum: ['en', 'hi', 'te'], default: 'en' }
    }
  },
  { timestamps: true }
);

export const Report = model<IReport>('Report', ReportSchema);
