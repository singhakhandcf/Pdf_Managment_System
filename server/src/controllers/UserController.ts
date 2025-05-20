import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponseDto } from '../Dto/ApiResponseDto';
import { HttpStatus } from '../constants/constants';


export class UserController{
    public router: Router;
    public userService:UserService;
    

    constructor(){
        this.router = Router();
        this.configureRoutes();
        this.userService=new UserService();
    }

    private configureRoutes(): void {
        this.router.post('/register',this.register);
        this.router.post('/login',this.login);
    }

    private register=async(req:Request,res:Response) :Promise<any>=>{
        try{
            const {name,email,password}=req.body;
            const response =await this.userService.registerUser(name,email,password);
            return res.status(response.responseCode??HttpStatus.OK).json(response);
        }
        catch(error){
            console.error("Error in registering user",error);
            res.status(500).json({ message: "Failed to register User!" });
        }
    }

    private login=async(req:Request,res:Response) :Promise<any>=>{
        try{
            const {email,password}=req.body;
            const response =await this.userService.loginUser(email,password);
            return res.status(response.responseCode??HttpStatus.OK).json(response);
        }
        catch(error){
            console.error("Error in logging user",error);
            res.status(500).json({ message: "Failed to login User!" });
        }
    }

    
}