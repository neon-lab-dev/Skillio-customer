import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";
import { registrationRoutes } from "../modules/registration/registration.routes";
import { chatRoutes } from "../modules/chat/chat.routes";
import { planMasterRouter } from "../modules/planMaster/route.plan.master";
import { notificaionRouter } from "../modules/notification/route.notificaion";
import { userSubscriptionRouter } from "../modules/userSubscription/route.user.subscription";
import { callRoutes } from "../modules/calling/call.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/v1/verificationRequest",
        route: verificationRoutes
    },
    {
        path: "/v1/document",
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

    },
    {
        path: "/v1/notification",
        route: notificaionRouter
    },
    {
        path: "/v1/user-subscription",
        route: userSubscriptionRouter

    },
    {
        path:"/v1/call",
        route:callRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;