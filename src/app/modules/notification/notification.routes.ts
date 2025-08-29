import notificationController from "./notification.controller";
import { Router } from "express";

const router = Router();

router.post("/send", notificationController.createNotification);

export const notificationRoutes = router;