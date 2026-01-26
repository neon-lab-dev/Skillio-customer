import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";
import { registrationRoutes } from "../modules/registration/registration.routes";
import { chatRoutes } from "../modules/chat/chat.routes";
import { planMasterRouter } from "../modules/planMaster/route.plan.master";

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
        path: "/v1/plan-master",
        route: planMasterRouter

    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;