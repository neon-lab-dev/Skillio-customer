import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";
import { registrationRoutes } from "../modules/registration/registration.routes";
import { chatRoutes } from "../modules/chat/chat.routes";
import { planMasterRouter } from "../modules/planMaster/route.plan.master";
import { notificaionRouter } from "../modules/notification/route.notificaion";
import { userSubscriptionRouter } from "../modules/userSubscription/route.user.subscription";
import { callRoutes } from "../modules/calling/call.routes";
import { planAggregatorRoutes } from "../modules/planAggregator/planAggregator.routes";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes";
import { tokenRouter } from "../modules/token/token.routes";
import { categoryRouter } from "../modules/category/category.routes";
import { subCategoryRouter } from "../modules/subCategory/subCategory.routes";
import { followsRouter } from "../modules/follows/follows.routes";

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
    },
    {
        path:"/v1/planAggregator",
        route:planAggregatorRoutes
    },
    {
        path: "/v1/dashboard",
        route: dashboardRouter
    },
    {
        path:"/v1/token",
        route: tokenRouter
    },
    {
        path:"/v1/category",
        route:categoryRouter
    },
    {
        path:"/v1/subCategory",
        route: subCategoryRouter
    },
    {
        path: "/v1/follows",
        route: followsRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;