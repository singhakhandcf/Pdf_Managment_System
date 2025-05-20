// models/ShareLink.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ShareLinkDocument extends Document {
  pdf: mongoose.Types.ObjectId;
  token: string;
  expiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ShareLinkSchema: Schema = new Schema(
  {
    pdf: {
      type: Schema.Types.ObjectId,
      ref: 'PDFFile',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const ShareLinkModel = mongoose.model<ShareLinkDocument>('ShareLink', ShareLinkSchema);
