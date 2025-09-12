import validateRequest from "../../middlewares/validateRequest";
import documentController from "./document.controller";
import { deleteDocumentSchema, documentRequestSchema } from "./document.validation";
import { updateDocumentSchema } from "./document.validation";
import { Router } from "express";
import singleUpload from "../../middlewares/multer";

const router= Router();


router.post("/" ,singleUpload,validateRequest(documentRequestSchema), documentController.createDocument);
router.put("/:id" ,singleUpload,validateRequest(updateDocumentSchema), documentController.updateDocument);
router.delete("/:id",validateRequest(deleteDocumentSchema), documentController.deleteDocument);

export const documentRoutes = router;