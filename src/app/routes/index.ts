import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";
import { registrationRoutes } from "../modules/registration/registration.routes";
import { chatRoutes } from "../modules/chat/chat.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verificationRoutes
    },
    {
        path: "/document",
        route: documentRoutes
    } , 
    {
        path: "/v1/profile",
        route: registrationRoutes
    },
    {
        path: "/v1/chat",
        route: chatRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;