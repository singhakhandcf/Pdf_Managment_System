// models/PDFFile.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Comment {
  userName?: string;
  user?: mongoose.Types.ObjectId | null;
  content: string;
  timestamp?: Date;
  repliedTo?: string | null;
}

export interface PDFFileModel extends Document {
  filename: string;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
  comments: Comment[];
}

const CommentSchema: Schema = new Schema<Comment>(
  {
    userName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    repliedTo: { type: String, default: null }, // Change to ObjectId if replies reference comments
  },
  { _id: false }
);

const PDFFileSchema: Schema = new Schema<PDFFileModel>(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const PDFFileModel = mongoose.model<PDFFileModel>('PDFFile', PDFFileSchema);
