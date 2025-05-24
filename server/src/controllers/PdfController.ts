import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponseDto } from '../Dto/ApiResponseDto';
import { ApiResponse, HttpStatus } from '../constants/constants';
import { auth } from '../middleware/authMiddleware';
import Pdf, { IComment } from '../models/PdfModel';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { sendShareEmail } from '../utils/email';
import { nanoid } from 'nanoid';

import fs from "fs";
import path from "path";
// import { ID, storage } from '../utils/appwrite';
//import { upload } from '../middleware/upload';
import { env } from 'process';
import { upload } from '../middleware/multerMiddlewar';



export class PdfController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post('/upload', auth(), upload.single('file'), this.createPdf);//d
        this.router.get('/:id', auth(), this.getPdfById);//d
        this.router.post('/:id/comment', auth(), this.comment);//d

        this.router.post('/share/:pdfId', auth(), this.shareLink);//d
        this.router.get('/public/share/:shareId', this.getSharedPdf);
        this.router.delete('/share/:id',auth(), this.revokeshareLink);

        this.router.post('/share/:shareId/comment',this.commentfromshareId);
        this.router.post('/share/:shareId/comment/:commentId/reply',this.replyfromshareId);

        this.router.get('/public/pdfs', auth(), this.getAllPdf);//d
        this.router.get('/view/mypdfs', auth(), this.getMyPdf);//d
        this.router.post('/:pdfId/comment/:commentId/reply',auth(), this.reply);//d
    }

    // private createappPdf = async (req: Request, res: Response): Promise<any> => {
    //     const apiResponseDto = new ApiResponseDto();
    //     try {
    //         const file = req.file;
    //         if (!file) {
    //             return res.status(400).json({ message: "Provide file" });
    //         }
    //         console.log("req.file:", file);

    //         //const filePath = path.join(__dirname, "../uploads", (req as any).file.filename);
    //         const filePath = path.join(__dirname, "../../uploads", file.filename); // go up two levels if __dirname is server/src
    //         console.log("Resolved file path:", filePath);
    //         console.log("File exists?", fs.existsSync(filePath));
    //         const fileStream = fs.createReadStream(file.path);

    //         const result = await storage.createFile(
    //             process.env.APP_WRITE_BUCKET_ID || "",
    //             ID.unique(),
    //             fs.createReadStream(file.path) as any,
    //             file.mimetype as any
    //         );


    //         //const result = await storage.createFile(process.env.APP_WRITE_BUCKET_ID||"", ID.unique(), fs.createReadStream(filePath) as any, (req as any).file.mimetype);
    //         // const uploadRes = await this.uploadPdfToAppwrite(file.path, file.filename);
    //         // const fileURL = this.getAppwriteFileURL(uploadRes.$id);
    //         const newPdf = await Pdf.create({
    //             title: file.originalname,
    //             url: result.$id,
    //             owner: (req as any).user._id,
    //             comments: [],
    //             sharedWith: [],
    //             shareId: nanoid(),
    //         });
    //         res.json({ url: result.$id });
    //     }
    //     catch (error) {
    //         console.error("Error in uploading pdf", error);
    //         res.status(500).json({ message: "Failed to upload Pdf!" });
    //     }
    // }

    // private getAppwriteFileURL = (fileId: string) => {
    //     return storage.getFileView("YOUR_BUCKET_ID", fileId); // returns a viewable URL
    // };


    private createPdf = async (req: Request, res: Response): Promise<any> => {
        const apiResponseDto = new ApiResponseDto();
        try {
            const { title } = req.body
            const file = req.file;
            const ext = file?.originalname.split('.').pop()?.toLowerCase() || "";
            if (!file || file.mimetype !== 'application/pdf' || ext !== 'pdf') {
                return res.status(400).json({ message: 'Only PDF files are allowed' });
            }
            const result = await uploadOnCloudinary(file.path);
            const newPdf = await Pdf.create({
                title: title,
                url: result.secure_url,
                owner: (req as any).user._id,
                ownerName: (req as any).user.name,
                comments: [],
                sharedWith: [],
                shareId: nanoid(),
            });

            apiResponseDto.status = ApiResponse.SUCCESS;
            apiResponseDto.message = 'Pdf Created successfully';
            apiResponseDto.responseCode = HttpStatus.CREATED;
            apiResponseDto.data = newPdf;
            return res.status(apiResponseDto.responseCode ?? HttpStatus.OK).json(apiResponseDto);
        }
        catch (error) {
            console.error("Error in uploading pdf", error);
            res.status(500).json({ message: "Failed to upload Pdf!" });
        }
    }

    private getPdfById = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Please provide id" });
            }
            const pdf = await Pdf.findById(id);
            return res.status(200).json({ pdf: pdf });

        }
        catch (error) {
            console.log("Error getting pdf by id", error);
            return res.status(500).json({ message: "Failed to get pdf by id" });
        }
    }

    private comment = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Please provide id" });
            }
            const { comment } = req.body;
            const name = (req as any).user.name as string;
            if (!comment || !name) {
                return res.status(400).json({ message: "Add some comment or login" });
            }


            const pdf = await Pdf.findById(id);
            if (!pdf) {
                return res.status(404).json({ message: "PDF not found" });
            }

            const newComment: IComment = {
                userName: name,
                text: comment,
                createdAt: new Date(),
                replies: []
            };
            pdf.comments.push(newComment);
            await pdf.save();
            return res.status(200).json({ pdf: pdf });

        }
        catch (error) {
            console.log("Error commenting", error);
            return res.status(500).json({ message: "Failed to comment" });
        }
    }

    private shareLink = async (req: Request, res: Response): Promise<any> => {
        const apiResponseDto = new ApiResponseDto();
        try {
            const { email } = req.body;
            const { pdfId } = req.params;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const userId = (req as any).user._id;
            const pdf = await Pdf.findOne({ _id: pdfId, owner: userId });
            if (!pdf) {
                return res.status(404).json({ message: "PDF not found!" });
            }
            if (pdf.owner.toString() !== (req as any).user._id.toString()) {
                return res.status(403).json({ message: 'Not allowed to share this file' });
            }
            let frontendUrl=process.env.FRONTEND_URL;
            let shareLink=`${frontendUrl}/shared/${pdf.shareId}`;

            await sendShareEmail(email, shareLink, (req as any).user.name);
            
            return res.status(200).json({ shareId: shareLink });
        }
        catch (error) {
            console.error("Error in generating link", error);
            res.status(500).json({ message: "Failed to generate Link!" });
        }
    }

    private getSharedPdf = async (req: Request, res: Response): Promise<any> => {
        try {
            const { shareId } = req.params;
            const pdf = await Pdf.findOne({ shareId });
            if (!pdf) {
                return res.status(404).json({ message: "PDF not found!" });
            }
            return res.status(200).json({
                pdf:pdf
            });
        }
        catch (error) {
            console.error("Error in getting pfg", error);
            res.status(500).json({ message: "Failed to get pdf!" });
        }
    }

    private revokeshareLink = async (req: Request, res: Response): Promise<any> => {
        try {
            const pdfId = req.params.id;
            const userId = (req as any).user._id;
            const pdf = await Pdf.findOne({ _id: pdfId, owner: userId });

            if (!pdf) return res.status(404).json({ message: 'PDF not found' });

            pdf.shareId = nanoid();
            await pdf.save();

            res.status(200).json({ message: 'Share link revoked successfully' });
        }
        catch (error) {
            console.error("Error in getting pfg", error);
            res.status(500).json({ message: "Failed to get pdf!" });
        }
    }

    private commentfromshareId = async (req: Request, res: Response): Promise<any> => {
        try {
            const { shareId } = req.params;
            const { userName, comment } = req.body;

            if (!userName || !comment) return res.status(400).json({ message: 'All fields are required' });

            const pdf = await Pdf.findOne({ shareId });
            if (!pdf) return res.status(404).json({ message: 'PDF not found' });

            const newComment: IComment = {
                userName,
                text: comment,
                createdAt: new Date(),
                replies: []
            };
            pdf.comments.push(newComment);
            await pdf.save();

            return res.status(200).json({ message: 'Comment added',pdf:pdf });
        }
        catch (error) {
            console.error("Error in commenting", error);
            res.status(500).json({ message: "Failed to comment!" });
        }
    }

    private replyfromshareId = async(req:Request,res:Response):Promise<any>=>{
        try {
            const text = req.body?.text;
            const userName=req.body.userName;
            const { shareId, commentId } = req.params;

            if (!userName || !text) {
                return res.status(400).json({ msg: 'userName and text are required' });
            }

            const pdf = await Pdf.findOne({shareId});
            if (!pdf) {
                return res.status(404).json({ msg: 'PDF not found' });
            }

            const comment = pdf.comments.find((c: any) => c._id.toString() === commentId);
            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            comment.replies.push({
                userName,
                text,
                createdAt: new Date()
            });

            await pdf.save();

            return res.status(201).json({ message: 'Reply added',pdf:pdf });
        }
        catch (error) {
            console.log("Error in replying", error);
            return res.status(500).json({ message: "Failed to reply !" });
        }        
    }

    private getAllPdf = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 9;
            const skip = (page - 1) * limit;
            const pdfs = await Pdf.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPdfs = await Pdf.countDocuments();
            const totalPages = Math.ceil(totalPdfs / limit);
            //totalPages=await Pdf.countDocuments()/10;

            return res.status(200).json({ data: { pdfs: pdfs, totalPages: totalPages } });

        }
        catch (error) {
            console.log("Error fetching Pdfs", error);
            return res.status(500).json({ message: "Failed to fetch PDFs" });
        }
    }

    private getMyPdf = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 9;
            const skip = (page - 1) * limit;
            const pdfs = await Pdf.find({ owner: (req as any).user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPdfs = await Pdf.countDocuments({ owner: (req as any).user._id });
            const totalPages = Math.ceil(totalPdfs / limit);

            return res.status(201).json({ data: { pdfs: pdfs, totalPages: totalPages } });
        }
        catch (error) {
            console.log("Error fetching Pdfs", error);
            return res.status(500).json({ message: "Failed to fetch PDFs" });
        }
    }

    private reply = async (req: Request, res: Response): Promise<any> => {
        try {
            const text = req.body?.text;
            const { pdfId, commentId } = req.params;

            const userName=(req as any).user.name;

            if (!userName || !text) {
                return res.status(400).json({ msg: 'userName and text are required' });
            }

            const pdf = await Pdf.findById(pdfId);
            if (!pdf) {
                return res.status(404).json({ msg: 'PDF not found' });
            }

            const comment = pdf.comments.find((c: any) => c._id.toString() === commentId);
            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            comment.replies.push({
                userName,
                text,
                createdAt: new Date()
            });

            await pdf.save();

            return res.status(201).json({ message: 'Reply added',pdf:pdf });
        }
        catch (error) {
            console.log("Error in replying", error);
            return res.status(500).json({ message: "Failed to reply !" });
        }
    }

    // private uploadPdfToAppwrite = async (filePath: string, fileName: string) => {
    //     try {
    //         const fileStream = fs.createReadStream(filePath); // make sure file exists
    //         const result = await storage.createFile(
    //             process.env.APP_WRITE_BUCKET_ID || "", // 🔁 Replace with your Appwrite bucket ID
    //             ID.unique(),
    //             fileStream as any
    //         );

    //         return result;
    //     } catch (error) {
    //         console.error("Upload to Appwrite failed:", error);
    //         throw error;
    //     }
    // };
}