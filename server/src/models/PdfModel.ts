import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto'


interface IReply {
  userName: string;
  text: string;
  createdAt: Date;
}

export interface IComment {
  userName: string;
  text: string;
  createdAt: Date;
  replies: IReply[];
}

export interface IPdf extends Document {
  title: string;
  url: string;
  owner: mongoose.Types.ObjectId;
  comments: IComment[];
  sharedWith: string[]; // emails or user IDs
  shareId:string;
}

const replySchema = new Schema<IReply>(
  {
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const commentSchema = new Schema<IComment>(
  {
    userName: { type: String, required: true },
    text: { type: String, required: true },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
  }
);


const pdfSchema = new Schema<IPdf>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
    sharedWith: [{ type: String }],
    shareId:{ type: String, unique: true, default: () => crypto.randomBytes(12).toString('hex') },
  },
  { timestamps: true }
);

const Pdf = mongoose.model<IPdf>('Pdf', pdfSchema);
export default Pdf;
