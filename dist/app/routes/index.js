"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_routes_1 = require("../modules/verification/verification.routes");
const document_routes_1 = require("../modules/document/document.routes");
const registration_routes_1 = require("../modules/registration/registration.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const call_routes_1 = require("../modules/calling/call.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/verificationRequest",
        route: verification_routes_1.verificationRoutes
    },
    {
        path: "/document",
        route: document_routes_1.documentRoutes
    },
    {
        path: "/v1/profile",
        route: registration_routes_1.registrationRoutes
    },
    {
        path: "/v1/message",
        route: chat_routes_1.chatRoutes
    },
    {
        path: "/v1/call",
        route: call_routes_1.callRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
