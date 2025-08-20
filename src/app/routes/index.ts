import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/people/people.routes";
import { categoriesRouter } from "../modules/category/categories.routes";
import { verticlesRouter } from "../modules/verticles/verticles.routes";

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
        path: "/category",
        route: categoriesRouter
    },
    {
        path: "/verticles",
        route: verticlesRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;