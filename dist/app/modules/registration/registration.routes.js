"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationRoutes = void 0;
const registration_controller_1 = __importDefault(require("./registration.controller"));
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const registration_validation_1 = require("./registration.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(registration_validation_1.registrationSchema), registration_controller_1.default.createProfile);
router.post("/login", (0, validateRequest_1.default)(registration_validation_1.LoginSchema), registration_controller_1.default.loginUser);
router.get("/:id", registration_controller_1.default.getProfile);
router.get("/", registration_controller_1.default.getProfiles);
exports.registrationRoutes = router;
