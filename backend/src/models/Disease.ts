import { Schema, model, Document } from 'mongoose';

export interface ITranslationDisease {
  name?: string;
  symptoms?: string;
  causes?: string;
  riskFactors?: string;
  diagnosis?: string;
  treatment?: string;
  prevention?: string;
  emergencySymptoms?: string;
}

export interface IDisease extends Document {
  name: string;
  symptoms: string;
  causes: string;
  riskFactors: string;
  diagnosis: string;
  treatment: string;
  prevention: string;
  emergencySymptoms: string;
  keywords: string[];
  translations: {
    hi?: ITranslationDisease;
    te?: ITranslationDisease;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseSchema = new Schema<IDisease>(
  {
    name: { type: String, required: true, index: true },
    symptoms: { type: String, required: true },
    causes: { type: String, required: true },
    riskFactors: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    prevention: { type: String, required: true },
    emergencySymptoms: { type: String, required: true },
    keywords: [{ type: String, index: true }],
    translations: {
      hi: {
        name: String,
        symptoms: String,
        causes: String,
        riskFactors: String,
        diagnosis: String,
        treatment: String,
        prevention: String,
        emergencySymptoms: String
      },
      te: {
        name: String,
        symptoms: String,
        causes: String,
        riskFactors: String,
        diagnosis: String,
        treatment: String,
        prevention: String,
        emergencySymptoms: String
      }
    }
  },
  { timestamps: true }
);

DiseaseSchema.index({
  name: 'text',
  symptoms: 'text',
  keywords: 'text',
  'translations.hi.name': 'text',
  'translations.te.name': 'text'
});

export const Disease = model<IDisease>('Disease', DiseaseSchema);
