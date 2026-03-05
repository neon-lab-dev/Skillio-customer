import validateRequest from "../../middlewares/validateRequest";
import documentController from "./document.controller";
import {  deleteDocumentsSchema, documentRequestSchema, getDocumentSchema } from "./document.validation";
import { updateDocumentSchema } from "./document.validation";
import { Router } from "express";
import singleUpload from "../../middlewares/multer";
import { FetchDocumentApi } from "./api/fetchDocumentsApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();
const fetchDocumentsApi= new FetchDocumentApi();

router.post("/" ,singleUpload,validateRequest(documentRequestSchema), documentController.createDocument);
router.get("/" ,validateRequest(getDocumentSchema), documentController.getDocument);
router.put("/" ,singleUpload,validateRequest(updateDocumentSchema), documentController.updateDocument);
router.post("/delete" ,validateRequest(deleteDocumentsSchema), documentController.deleteDocuments);

router.get(
    "/:portfolioId", 
    verifyToken,
    asyncApiHandler(fetchDocumentsApi)
)

export const documentRoutes = router;