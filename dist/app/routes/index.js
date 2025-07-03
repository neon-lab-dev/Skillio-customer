"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_routes_1 = require("../modules/user/user.routes");
const categories_routes_1 = require("../modules/category/categories.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter
    },
    {
        path: "/people",
        route: user_routes_1.userRouter
    },
    {
        path: "/categories",
        route: categories_routes_1.categoriesRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
