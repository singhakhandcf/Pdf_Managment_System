import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadOnCloudinary = async (localFilePath: string): Promise<any> => {
 try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // required for PDF
    });

    fs.unlinkSync(localFilePath); // cleanup
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};


const deleteFromCloudinary = async (fileUrl:string):Promise<void> => {
    try {
        const parts = fileUrl.split('/');
        const filenameWithExt = parts.pop(); // e.g. image.jpg
        if (!filenameWithExt) {
            throw new Error("Invalid file URL: No filename found");
        }

        const publicId = filenameWithExt.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        console.log('File deleted from Cloudinary', fileUrl);
    } 
    catch (error) {
      console.error('Failed to delete file from Cloudinary', error);
    }
};

export {uploadOnCloudinary,deleteFromCloudinary};
