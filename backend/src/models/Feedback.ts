import { Schema, model, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId?: Schema.Types.ObjectId;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Feedback = model<IFeedback>('Feedback', FeedbackSchema);
