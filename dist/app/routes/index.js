"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_routes_1 = require("../modules/verification/verification.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verification_routes_1.verificationRoutes
    },
    {
        path: "/notification",
        route: notification_routes_1.notificationRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
