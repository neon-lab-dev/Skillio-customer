"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("./sendResponse"));
const jwtConfig_1 = require("../modules/registration/config/jwtConfig");
const registrationRepository_1 = __importDefault(require("../repository/registrationRepository"));
const logger_1 = __importDefault(require("../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../errors/appError"));
exports.verifyToken = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger_1.default.error("No authorization header provided");
        throw new appError_1.default(401, "No authorization header provided");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        logger_1.default.error("Invalid authorization token");
        throw new appError_1.default(401, "Invalid authorization token");
    }
    const jwtConfig = await (0, jwtConfig_1.getJwtConfig)();
    const decoded = jsonwebtoken_1.default.verify(token, jwtConfig.JWT_ACCESS_SECRET);
    const profile = await registrationRepository_1.default.findProfileById(decoded.profileId);
    if (!profile)
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized access"
        });
    req.user = decoded;
    next();
});
