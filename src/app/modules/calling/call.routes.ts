import { Router } from "express";
import { acceptCallSchema, createCallSchema, endCallSchema, rejectCallSchema } from "./call.validation";
import { verifyToken } from "../../middlewares/requireAuth";
import validateRequest from "../../middlewares/validateRequest";
import callController from "./call.controller";
import { FetchTokenApi } from "./api/fetchTokenApi";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import twilioWebhook from "./webhook/twilioWebhook";

const router=Router();
const fetchTokenApi= new FetchTokenApi()

router.post("/" , verifyToken , validateRequest(createCallSchema) , callController.createCall)
router.put("/accept" , verifyToken , validateRequest(acceptCallSchema) , callController.accecptCall)
router.put("/reject" , verifyToken, validateRequest(rejectCallSchema) , callController.rejectCall)
router.put("/end" , verifyToken , validateRequest(endCallSchema) , callController.endCall)
router.get(
    "/token",
    verifyToken,
    asyncApiHandler(fetchTokenApi)
)
router.post(
    "/twiml",
    twilioWebhook.twimlPost
)

export const callRoutes=router;