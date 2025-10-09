"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationRoutes = void 0;
const registration_controller_1 = __importDefault(require("./registration.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", registration_controller_1.default.createProfile);
router.post("/login", registration_controller_1.default.loginUser);
exports.registrationRoutes = router;
