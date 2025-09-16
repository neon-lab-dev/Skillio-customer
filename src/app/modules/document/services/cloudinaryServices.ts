import { v2 as cloudinary } from "cloudinary";
import { logger } from "../../../utils/logger";
import AppError from "../../../errors/appError";

class CloudinaryService {
  uploadFile = async (file: Express.Multer.File) => {
    try {
      const res = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "skilioDocument",
        }
      );

      return res;
    } catch (error) {
        logger.error("Error uploading file to Cloudinary:", error);
        throw new AppError(500, "Error uploading file to Cloudinary");
    }
  };

  deleteFile=async(publicId: string)=>{
    try{
       await cloudinary.uploader
        .destroy(publicId as string)
        .then(result => console.log(result));
    }catch(error){
        logger.error("Error deleting file from Cloudinary:", error);
    }
  }
}


export default new CloudinaryService();