import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { logger } from "../../../utils/logger";
import AppError from "../../../errors/appError";

class CloudinaryService {
  uploadFile = async (file: Express.Multer.File) => {
    try {

      const isVideo = file.mimetype.startsWith("video/");
      const isImage = file.mimetype.startsWith("image/");

      const uploadOptions : UploadApiOptions = {
        folder: "skilioDocument",
        resource_type: isVideo ? "video" : isImage ? "image" : "auto",
      };

      const res = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        uploadOptions
      );

      return res;
    } catch (error) {
        logger.error("Error uploading file:", error);
        throw new AppError(500, "Error uploading file.");
    }
  };

  deleteFile=async(publicId: string)=>{
    try{
       await cloudinary.uploader
        .destroy(publicId as string)
        .then(result => console.log(result));
    }catch(error){
        logger.error("Error deleting file:", error);
    }
  }
}


export default new CloudinaryService();