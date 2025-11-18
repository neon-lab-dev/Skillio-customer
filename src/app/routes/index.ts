import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";
import { registrationRoutes } from "../modules/registration/registration.routes";
import { chatRoutes } from "../modules/chat/chat.routes";
import { callRoutes } from "../modules/calling/call.routes";

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
        path: "/v1/message",
        route: chatRoutes
    },
    {
        path:"/v1/call",
        route:callRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;