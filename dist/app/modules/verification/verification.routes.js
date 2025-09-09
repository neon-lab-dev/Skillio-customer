"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRoutes = void 0;
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const verification_controller_1 = __importDefault(require("./verification.controller"));
const verification_validation_1 = require("./verification.validation");
const verification_validation_2 = require("./verification.validation");
const verification_validation_3 = require("./verification.validation");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(verification_validation_1.verificationRequestSchema), verification_controller_1.default.verificationRequest);
router.post("/resendOtp", (0, validateRequest_1.default)(verification_validation_2.resendOtpSchema), verification_controller_1.default.reSendOtp);
router.post("/verifyOtp", (0, validateRequest_1.default)(verification_validation_3.verifyOtpSchema), verification_controller_1.default.verifyOtp);
exports.verificationRoutes = router;
