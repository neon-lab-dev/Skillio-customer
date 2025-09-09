"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const notification_controller_1 = __importDefault(require("./notification.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/send", notification_controller_1.default.createNotification);
exports.notificationRoutes = router;
