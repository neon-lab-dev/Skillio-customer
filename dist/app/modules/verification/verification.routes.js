"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRoutes = void 0;
const verification_controller_1 = __importDefault(require("./verification.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", verification_controller_1.default.verificationRequest);
router.post("/:verificationId", verification_controller_1.default.verifyOtp);
exports.verificationRoutes = router;
