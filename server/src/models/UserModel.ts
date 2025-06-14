import mongoose, { Schema, Document } from 'mongoose';

export interface UserModel extends Document {
    name:string;
    email:string;
    password:string;
    isAdmin:boolean;
}

const UserSchema: Schema = new Schema({
    name:{type: String , required:true},
    email:{type: String , required:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
}, { timestamps: true });

export const UserModel = mongoose.model<UserModel>('User', UserSchema);