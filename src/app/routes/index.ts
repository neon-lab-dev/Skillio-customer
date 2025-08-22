import { Router } from "express";
import { verificationRoutes } from "../modules/verification/verification.routes";


const router = Router();

const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verificationRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;