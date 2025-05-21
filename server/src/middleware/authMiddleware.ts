import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

dotenv.config();

export const auth=()=> async(req:Request,res:Response,next:NextFunction):Promise<any>=>{

    const token =req.header("Authorization")?.startsWith("Bearer ")?req.header("Authorization")?.split(" ")[1]:undefined;

    if(!token){
        return res.status(401).json({message:"Unauthorized- No token Provided"});
    }

    try{
        const decoded=jwt.verify(token as string,process.env.JWT_SECRET as string) as { id: string };
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ msg: 'User not found' });
        (req as any).user = user;
        next();
    }
    catch(error){
        console.log("Error: ",error);
        res.status(401).json({ msg: 'Invalid token' });
    }

}