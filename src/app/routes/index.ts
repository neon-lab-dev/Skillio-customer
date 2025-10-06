import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";
import { documentRoutes } from "../modules/document/document.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verificationRoutes
    },
    {
        path: "/document",
        route: documentRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;