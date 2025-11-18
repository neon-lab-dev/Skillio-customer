"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRoutes = void 0;
const express_1 = require("express");
const call_validation_1 = require("./call.validation");
const requireAuth_1 = require("../../middlewares/requireAuth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const call_controller_1 = __importDefault(require("./call.controller"));
const router = (0, express_1.Router)();
router.post("/", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.createCallSchema), call_controller_1.default.createCall);
router.put("/", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.updateCallSchema), call_controller_1.default.updateCall);
router.put("/accept", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.acceptCallSchema), call_controller_1.default.accecptCall);
router.put("/reject", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.rejectCallSchema), call_controller_1.default.rejectCall);
router.put("/end", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.endCallSchema), call_controller_1.default.endCall);
router.post("/iceCandidate", requireAuth_1.verifyToken, (0, validateRequest_1.default)(call_validation_1.sendIceCandidateSchema), call_controller_1.default.sendIceCandidate);
exports.callRoutes = router;
