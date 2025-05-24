import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponseDto } from '../Dto/ApiResponseDto';
import { ApiResponse, HttpStatus } from '../constants/constants';
import { auth } from '../middleware/authMiddleware';
import Pdf from '../models/PdfModel';
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
        this.router.post('/upload', auth(), upload.single('file'), this.createPdf);
       // this.router.post('/upload', auth(), upload.single("file"), this.createappPdf);
        this.router.get('/share/:pdfId', auth(), this.shareLink);
        this.router.get('/public/share/:shareId', this.getPdfBylink);
        this.router.post('/public/:shareId/comment', this.commentfromshareId);
        this.router.get('/public/pdfs', this.getAllPdf);
        this.router.get('/mypdfs', auth(), this.getMyPdf);
        this.router.post('/pdf/:pdfId/comment/:commentId/reply', this.reply);
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
            const {title}=req.body
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

    private shareLink = async (req: Request, res: Response): Promise<any> => {
        const apiResponseDto = new ApiResponseDto();
        try {
            const { email } = req.body;
            const { pdfId } = req.params;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const pdf = await Pdf.findById(pdfId);
            if (!pdf) {
                return res.status(404).json({ message: "PDF not found!" });
            }
            if (pdf.owner.toString() !== (req as any).user._id.toString()) {
                return res.status(403).json({ msg: 'Not allowed to share this file' });
            }
            const shareLink = `${process.env.CLIENT_URL}/shared/${pdf.shareId}`;
            await sendShareEmail(email, shareLink, (req as any).user.name);
            return res.status(200).json({ shareLink });
        }
        catch (error) {
            console.error("Error in generating link", error);
            res.status(500).json({ message: "Failed to generate Link!" });
        }
    }

    private getPdfBylink = async (req: Request, res: Response): Promise<any> => {
        try {
            const { shareId } = req.params;
            const pdf = await Pdf.findOne({ shareId });
            if (!pdf) {
                return res.status(404).json({ message: "PDF not found!" });
            }
            return res.status(200).json({
                title: pdf.title,
                url: pdf.url,
                comments: pdf.comments,
            });
        }
        catch (error) {
            console.error("Error in generating link", error);
            res.status(500).json({ message: "Failed to generate Link!" });
        }
    }

    private commentfromshareId = async (req: Request, res: Response): Promise<any> => {
        try {
            const { shareId } = req.params;
            const { userName, comment } = req.body;

            if (!userName || !comment) return res.status(400).json({ msg: 'All fields are required' });

            const pdf = await Pdf.findOne({ shareId });
            if (!pdf) return res.status(404).json({ message: 'PDF not found' });

            pdf.comments.push({ userName, text: comment, createdAt: new Date(), replies: [] });
            await pdf.save();

            return res.status(200).json({ message: 'Comment added' });
        }
        catch (error) {
            console.error("Error in commenting", error);
            res.status(500).json({ message: "Failed to comment!" });
        }
    }

    private getAllPdf = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            // console.log(page);
            // console.log(limit);
            const skip = (page - 1) * limit;
            const pdfs = await Pdf.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            let totalPages=1;
            //totalPages=await Pdf.countDocuments()/10;

            return res.status(200).json({ data:{pdfs:pdfs,totalPages:totalPages} });

        }
        catch (error) {
            console.log("Error fetching Pdfs", error);
            return res.status(500).json({ message: "Failed to fetch PDFs" });
        }
    }

    private getMyPdf = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 1;
            const skip = (page - 1) * limit;
            const pdfs = await Pdf.find({ owner: (req as any).user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.status(201).json({ data: pdfs });
        }
        catch (error) {
            console.log("Error fetching Pdfs", error);
            return res.status(500).json({ message: "Failed to fetch PDFs" });
        }
    }

    private reply = async (req: Request, res: Response): Promise<any> => {
        try {
            const { userName, text } = req.body;
            const { pdfId, commentId } = req.params;

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

            return res.status(201).json({ msg: 'Reply added', comment });
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