import { Schema, model, Document } from 'mongoose';

export interface ITranslationMedicalTest {
  name?: string;
  purpose?: string;
  normalRange?: string;
  highMeaning?: string;
  lowMeaning?: string;
  preparation?: string;
}

export interface IMedicalTest extends Document {
  name: string;
  purpose: string;
  sampleType: string;
  normalRange: string;
  highMeaning: string;
  lowMeaning: string;
  preparation: string;
  category: string;
  keywords: string[];
  translations: {
    hi?: ITranslationMedicalTest;
    te?: ITranslationMedicalTest;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MedicalTestSchema = new Schema<IMedicalTest>(
  {
    name: { type: String, required: true, index: true },
    purpose: { type: String, required: true },
    sampleType: { type: String, required: true },
    normalRange: { type: String, required: true },
    highMeaning: { type: String, required: true },
    lowMeaning: { type: String, required: true },
    preparation: { type: String, required: true },
    category: { type: String, required: true, index: true },
    keywords: [{ type: String, index: true }],
    translations: {
      hi: {
        name: String,
        purpose: String,
        normalRange: String,
        highMeaning: String,
        lowMeaning: String,
        preparation: String
      },
      te: {
        name: String,
        purpose: String,
        normalRange: String,
        highMeaning: String,
        lowMeaning: String,
        preparation: String
      }
    }
  },
  { timestamps: true }
);

MedicalTestSchema.index({
  name: 'text',
  purpose: 'text',
  category: 'text',
  keywords: 'text',
  'translations.hi.name': 'text',
  'translations.te.name': 'text'
});

export const MedicalTest = model<IMedicalTest>('MedicalTest', MedicalTestSchema);
