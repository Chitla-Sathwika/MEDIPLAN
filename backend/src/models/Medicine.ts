import { Schema, model, Document } from 'mongoose';

export interface ITranslationMedicine {
  name?: string;
  genericName?: string;
  brandName?: string;
  uses?: string;
  sideEffects?: string;
  warnings?: string;
  precautions?: string;
  storage?: string;
}

export interface IMedicine extends Document {
  name: string;
  genericName: string;
  brandName: string;
  strength: string;
  dosage: string;
  uses: string;
  sideEffects: string;
  warnings: string;
  precautions: string;
  storage: string;
  manufacturer: string;
  prescriptionRequired: boolean;
  category: string;
  keywords: string[];
  translations: {
    hi?: ITranslationMedicine;
    te?: ITranslationMedicine;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, index: true },
    genericName: { type: String, required: true, index: true },
    brandName: { type: String, required: true, index: true },
    strength: { type: String, required: true },
    dosage: { type: String, required: true },
    uses: { type: String, required: true },
    sideEffects: { type: String, required: true },
    warnings: { type: String, required: true },
    precautions: { type: String, required: true },
    storage: { type: String, required: true },
    manufacturer: { type: String, required: true },
    prescriptionRequired: { type: Boolean, default: false },
    category: { type: String, required: true, index: true },
    keywords: [{ type: String, index: true }],
    translations: {
      hi: {
        name: String,
        genericName: String,
        brandName: String,
        uses: String,
        sideEffects: String,
        warnings: String,
        precautions: String,
        storage: String
      },
      te: {
        name: String,
        genericName: String,
        brandName: String,
        uses: String,
        sideEffects: String,
        warnings: String,
        precautions: String,
        storage: String
      }
    }
  },
  { timestamps: true }
);

// Text Index for full-text search capabilities
MedicineSchema.index({
  name: 'text',
  genericName: 'text',
  brandName: 'text',
  uses: 'text',
  category: 'text',
  keywords: 'text',
  'translations.hi.name': 'text',
  'translations.te.name': 'text'
});

export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
