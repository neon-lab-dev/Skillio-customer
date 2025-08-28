import notificationController from "./notification.controller";
import { Router } from "express";

const router = Router();

router.post("/send", notificationController.createNotification);
router.get("/", notificationController.getAllNotifications);
router.get("/medium", notificationController.getNotificationByMedium);
router.get("/status", notificationController.getNotificationsByStatus);
router.get("/:notificationId", notificationController.getNotificaionById);


export const notificationRoutes = router;