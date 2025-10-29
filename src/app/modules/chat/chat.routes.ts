import { Router } from "express";
import chatController from "./chat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { verifyToken } from "../../middlewares/requireAuth";
import { sendMessageSchema, getMessagesSchema } from "./chat.validation";
import singleUpload from "../../middlewares/multer";

const router= Router();

router.post("/" , verifyToken ,singleUpload, validateRequest(sendMessageSchema) , chatController.createMessage);
router.get("/" , verifyToken , validateRequest(getMessagesSchema) , chatController.getMesssages);

export const chatRoutes= router;
