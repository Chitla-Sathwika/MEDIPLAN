import { Schema, model, Document } from 'mongoose';

export interface ISearchHistory extends Document {
  userId: Schema.Types.ObjectId;
  query: string;
  createdAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    query: { type: String, required: true, trim: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SearchHistory = model<ISearchHistory>('SearchHistory', SearchHistorySchema);
