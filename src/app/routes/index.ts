import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { categoriesRouter } from "../modules/category/categories.routes";

const router = Router();

const moduleRoutes=[
    {
        path:"/auth",
        route: authRouter
    },
    {
        path: "/categories",
        route: categoriesRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;