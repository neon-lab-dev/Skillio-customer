import { Router } from "express";
import { acceptCallSchema, createCallSchema, endCallSchema, rejectCallSchema, sendIceCandidateSchema, updateCallSchema } from "./call.validation";
import { verifyToken } from "../../middlewares/requireAuth";
import validateRequest from "../../middlewares/validateRequest";
import callController from "./call.controller";

const router=Router();

router.post("/" , verifyToken , validateRequest(createCallSchema) , callController.createCall)
router.put("/" , verifyToken , validateRequest(updateCallSchema) , callController.updateCall)
router.put("/accept" , verifyToken , validateRequest(acceptCallSchema) , callController.accecptCall)
router.put("/reject" , verifyToken, validateRequest(rejectCallSchema) , callController.rejectCall)
router.put("/end" , verifyToken , validateRequest(endCallSchema) , callController.endCall)
router.post("/iceCandidate" , verifyToken , validateRequest(sendIceCandidateSchema) , callController.sendIceCandidate)

export const callRoutes=router;