"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const people_routes_1 = require("../modules/people/people.routes");
const categories_routes_1 = require("../modules/category/categories.routes");
const verticles_routes_1 = require("../modules/verticles/verticles.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter
    },
    {
        path: "/people",
        route: people_routes_1.userRouter
    },
    {
        path: "/category",
        route: categories_routes_1.categoriesRouter
    },
    {
        path: "/verticles",
        route: verticles_routes_1.verticlesRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
