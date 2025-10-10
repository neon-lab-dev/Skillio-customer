"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const logger_1 = require("../../../utils/logger");
const appError_1 = __importDefault(require("../../../errors/appError"));
class CloudinaryService {
    constructor() {
        this.uploadFile = async (file) => {
            try {
                const res = await cloudinary_1.v2.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
                    folder: "skilioDocument",
                });
                return res;
            }
            catch (error) {
                logger_1.logger.error("Error uploading file:", error);
                throw new appError_1.default(500, "Error uploading file.");
            }
        };
        this.deleteFile = async (publicId) => {
            try {
                await cloudinary_1.v2.uploader
                    .destroy(publicId)
                    .then(result => console.log(result));
            }
            catch (error) {
                logger_1.logger.error("Error deleting file:", error);
            }
        };
    }
}
exports.default = new CloudinaryService();
