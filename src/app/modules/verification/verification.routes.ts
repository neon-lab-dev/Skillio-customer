import validateRequest from "../../middlewares/validateRequest";
import verificationController from "./verification.controller";
import { verificationRequestSchema } from "./verification.validation"
import { resendOtpSchema } from "./verification.validation";
import { verifyOtpSchema } from "./verification.validation";
import { Router } from "express";

const router= Router();

router.post("/" ,validateRequest(verificationRequestSchema), verificationController.verificationRequest);
router.post("/resendOtp", validateRequest(resendOtpSchema) , verificationController.reSendOtp);
router.post("/verifyOtp", validateRequest(verifyOtpSchema) , verificationController.verifyOtp);

export const verificationRoutes = router;