import { Schema, model, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: Schema.Types.ObjectId;
  itemType: 'medicine' | 'test' | 'disease';
  itemId: Schema.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemType: { type: String, enum: ['medicine', 'test', 'disease'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Ensure a user can bookmark a specific item only once
BookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Bookmark = model<IBookmark>('Bookmark', BookmarkSchema);
