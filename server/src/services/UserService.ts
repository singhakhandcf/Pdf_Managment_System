import { Router, Request, Response } from "express";
import { ApiResponseDto } from "../Dto/ApiResponseDto";
import { ApiResponse, HttpStatus } from "../constants/constants";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/otp";
import otps from "../utils/OtpStore";


export class UserService {


    public async registerUser(name: string | null, email: string | null, password: string | null): Promise<ApiResponseDto<any>> {
        const apiResponseDto = new ApiResponseDto();
        try {
            if (!name || !email || !password) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "Please Enter requeried informations";
                apiResponseDto.responseCode = HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const User = await UserModel.findOne({ email: email });
            if (User) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "User Already exists";
                apiResponseDto.responseCode = HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ name, email, password: hashedPassword });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            apiResponseDto.status = ApiResponse.SUCCESS;
            apiResponseDto.message = 'User registered successfully';
            apiResponseDto.responseCode = HttpStatus.CREATED;
            apiResponseDto.data = {
                "token": token,
                "data": newUser,
                "name": newUser.name
            }
            return apiResponseDto;
        }
        catch (error) {
            console.log("Error :", error);
            apiResponseDto.status = ApiResponse.ERROR;
            apiResponseDto.message = ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }

    public async loginUser(email: string | null, password: string | null): Promise<ApiResponseDto<any>> {
        const apiResponseDto = new ApiResponseDto();
        try {
            if (!email || !password) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "Please Enter requeried informations";
                apiResponseDto.responseCode = HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const User = await UserModel.findOne({ email: email });
            if (!User) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "User Not Found";
                apiResponseDto.responseCode = HttpStatus.NOT_FOUND;
                return apiResponseDto;
            }
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "Wrong Password";
                apiResponseDto.responseCode = HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            apiResponseDto.status = ApiResponse.SUCCESS;
            apiResponseDto.message = 'User Logged in successfully';
            apiResponseDto.responseCode = HttpStatus.CREATED;
            apiResponseDto.data = {
                "token": token,
                "data": User,
                "name": User.name
            }
            return apiResponseDto;
        }
        catch (error) {
            console.log("Error :", error);
            apiResponseDto.status = ApiResponse.ERROR;
            apiResponseDto.message = ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }

    public async forgotPassword(email: string | null): Promise<ApiResponseDto<any>> {
        const apiResponseDto = new ApiResponseDto();
        try {
            if (!email) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "Please Enter email";
                apiResponseDto.responseCode = HttpStatus.BAD_REQUEST;
                return apiResponseDto;
            }
            const User = await UserModel.findOne({ email: email });
            if (!User) {
                apiResponseDto.status = ApiResponse.ERROR;
                apiResponseDto.message = "User Not Found";
                apiResponseDto.responseCode = HttpStatus.NOT_FOUND;
                return apiResponseDto;
            }

            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const normalizedEmail = (email ?? "").trim().toLowerCase();
            otps.set(normalizedEmail, otp);
            console.log(otps.get(normalizedEmail));
            console.log(otps);
            await sendOtpEmail(email, otp);

            apiResponseDto.status = ApiResponse.SUCCESS;
            apiResponseDto.message = 'OTP Sent';
            apiResponseDto.responseCode = HttpStatus.CREATED;
            apiResponseDto.data = {
                "otp": otp
            }
            return apiResponseDto;
        }
        catch (error) {
            console.log("Error :", error);
            apiResponseDto.status = ApiResponse.ERROR;
            apiResponseDto.message = ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }

    public async verifyOtp(email: string | null, otp: string | null): Promise<ApiResponseDto<any>> {
        const apiResponseDto = new ApiResponseDto();
        try {
            const normalizedEmail = (email ?? "").trim().toLowerCase();
            console.log(otps.get(normalizedEmail));
            if (otps.get(normalizedEmail) === otp) {
                otps.delete(normalizedEmail);
                apiResponseDto.status = ApiResponse.SUCCESS;
                apiResponseDto.message = 'OTP Verified';
                apiResponseDto.responseCode = HttpStatus.CREATED;
                apiResponseDto.data = {
                    "otp": otp
                }
                return apiResponseDto;
            }

            apiResponseDto.status = ApiResponse.ERROR;
            apiResponseDto.message = "Please enter correct OTP";
            apiResponseDto.responseCode = HttpStatus.NOT_FOUND;
            return apiResponseDto;
        }
        catch (error) {
            console.log("Error :", error);
            apiResponseDto.status = ApiResponse.ERROR;
            apiResponseDto.message = ApiResponse.GENERIC_ERROR_MESSAGE;
            apiResponseDto.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return apiResponseDto;
        }
    }
}