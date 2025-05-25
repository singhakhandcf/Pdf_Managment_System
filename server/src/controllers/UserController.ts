import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponseDto } from '../Dto/ApiResponseDto';
import { HttpStatus } from '../constants/constants';
import { UserModel } from '../models/UserModel';
import bcrypt from "bcryptjs"


export class UserController {
    public router: Router;
    public userService: UserService;


    constructor() {
        this.router = Router();
        this.configureRoutes();
        this.userService = new UserService();
    }

    private configureRoutes(): void {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
        this.router.post('/forgot-password', this.forgetPassword);
        this.router.post('/verify-otp', this.verifyOtp);
        this.router.post('/reset-password', this.resetPassword);
    }

    private register = async (req: Request, res: Response): Promise<any> => {
        try {
            const { name, email, password } = req.body;
            const response = await this.userService.registerUser(name, email, password);
            return res.status(response.responseCode ?? HttpStatus.OK).json(response);
        }
        catch (error) {
            console.error("Error in registering user", error);
            res.status(500).json({ message: "Failed to register User!" });
        }
    }

    private login = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const response = await this.userService.loginUser(email, password);
            return res.status(response.responseCode ?? HttpStatus.OK).json(response);
        }
        catch (error) {
            console.error("Error in logging user", error);
            res.status(500).json({ message: "Failed to login User!" });
        }
    }

    private forgetPassword = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email } = req.body;
            const response = await this.userService.forgotPassword(email);
            return res.status(response.responseCode ?? HttpStatus.OK).json(response);
        }
        catch (error) {
            console.error("Error in generating otp", error);
            res.status(500).json({ message: "Failed to send otp!" });
        }
    }

    private verifyOtp = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, otp } = req.body;
            const response = await this.userService.verifyOtp(email, otp);
            return res.status(response.responseCode ?? HttpStatus.OK).json(response);
        }
        catch (error) {
            console.error("Error in verifying otp", error);
            res.status(500).json({ message: "Failed to verify otp!" });
        }
    }

    private resetPassword = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, newPassword } = req.body;
            const hashed = await bcrypt.hash(newPassword, 10);
            const updated = await UserModel.findOneAndUpdate({ email }, { password: hashed });
            if (!updated) return res.status(404).json({ message: "User not found" });
            res.json({ message: "Password updated" });
        }
        catch (error) {
            console.error("Error in reseting password", error);
            res.status(500).json({ message: "Failed to reset password!" });
        }
    }

}