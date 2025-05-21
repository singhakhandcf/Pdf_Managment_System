import { Router,Request,Response } from "express";
import { ApiResponseDto } from "../Dto/ApiResponseDto";
import { ApiResponse, HttpStatus } from "../constants/constants";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


export class UserService{


    public async registerUser(name:string|null,email:string|null,password:string|null):Promise<ApiResponseDto<any>>{
        const apiResponseDto = new ApiResponseDto();
        try{
            if(!name||!email||!password){
                apiResponseDto.status=ApiResponse.ERROR;
                apiResponseDto.message="Please Enter requeried informations";
                apiResponseDto.responseCode=HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const User=await UserModel.findOne({email:email});
            if(User){
                apiResponseDto.status=ApiResponse.ERROR;
                apiResponseDto.message="User Already exists";
                apiResponseDto.responseCode=HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const hashedPassword=await bcrypt.hash(password,10);
            const newUser =new UserModel({name,email,password:hashedPassword});
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            apiResponseDto.status=ApiResponse.SUCCESS;
            apiResponseDto.message='User registered successfully';
            apiResponseDto.responseCode=HttpStatus.CREATED;
            apiResponseDto.data={
                "token":token,
                "data":newUser
            }
            return apiResponseDto;
        }
        catch(error){
            console.log("Error :", error);
            apiResponseDto.status=ApiResponse.ERROR;
            apiResponseDto.message=ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode=HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }

    public async loginUser(email:string|null,password:string |null):Promise<ApiResponseDto<any>>{
        const apiResponseDto = new ApiResponseDto();
        try{
            if(!email||!password){
                apiResponseDto.status=ApiResponse.ERROR;
                apiResponseDto.message="Please Enter requeried informations";
                apiResponseDto.responseCode=HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const User=await UserModel.findOne({email:email});
            if(!User){
                apiResponseDto.status=ApiResponse.ERROR;
                apiResponseDto.message="User Not Found";
                apiResponseDto.responseCode=HttpStatus.NOT_FOUND;
                return apiResponseDto;
            }
            const isMatch = await bcrypt.compare(password, User.password);
            if(!isMatch){
                apiResponseDto.status=ApiResponse.ERROR;
                apiResponseDto.message="Wrong Password";
                apiResponseDto.responseCode=HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            apiResponseDto.status=ApiResponse.SUCCESS;
            apiResponseDto.message='User Logged in successfully';
            apiResponseDto.responseCode=HttpStatus.CREATED;
            apiResponseDto.data={
                "token":token,
                "data":User
            }
            return apiResponseDto;
        }
        catch(error){
            console.log("Error :", error);
            apiResponseDto.status=ApiResponse.ERROR;
            apiResponseDto.message=ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode=HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }
}