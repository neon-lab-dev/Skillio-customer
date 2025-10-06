"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_routes_1 = require("../modules/verification/verification.routes");
const document_routes_1 = require("../modules/document/document.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verification_routes_1.verificationRoutes
    },
    {
        path: "/document",
        route: document_routes_1.documentRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
