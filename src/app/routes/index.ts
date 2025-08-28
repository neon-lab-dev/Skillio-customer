import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { notificationRoutes } from "../modules/notification/notification.routes";


const router = Router();

const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verificationRoutes
    }, 
    {
        path: "/notification",
        route: notificationRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;