import verificationController from "./verification.controller";
import { Router } from "express";

const router= Router();

router.post("/" , verificationController.verificationRequest);
router.post("/:verificationId" , verificationController.verifyOtp);

export const verificationRoutes = router;