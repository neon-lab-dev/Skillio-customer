import validateRequest from "../../middlewares/validateRequest";
import documentController from "./document.controller";
import {  deleteDocumentsSchema, documentRequestSchema, getDocumentSchema } from "./document.validation";
import { updateDocumentSchema } from "./document.validation";
import { Router } from "express";
import singleUpload from "../../middlewares/multer";

const router= Router();

router.post("/" ,singleUpload,validateRequest(documentRequestSchema), documentController.createDocument);
router.get("/:id" ,validateRequest(getDocumentSchema), documentController.getDocument);
router.put("/profile-picture" ,singleUpload,validateRequest(updateDocumentSchema), documentController.updateDocument);
router.post("/delete" ,validateRequest(deleteDocumentsSchema), documentController.deleteDocuments);

export const documentRoutes = router;