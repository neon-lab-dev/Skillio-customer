import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.routes";
import { categoriesRouter } from "../modules/category/categories.routes";

const router = Router();

const moduleRoutes=[
    {
        path:"/auth",
        route: authRouter
    },
    {
        path: "/people",
        route: userRouter
    },
    {
        path: "/categories",
        route: categoriesRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;