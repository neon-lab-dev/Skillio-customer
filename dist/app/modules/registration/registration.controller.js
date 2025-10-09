"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registration_proxy_1 = __importDefault(require("./registration.proxy"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const registration_dto_1 = require("./registration.dto");
class RegistrationController {
    constructor() {
        // create/register a profile
        this.createProfile = (0, catchAsyncError_1.default)(async (req, res) => {
            const profileData = new registration_dto_1.RegistrationDTO(req.body);
            const result = await registration_proxy_1.default.createProfile({ ...profileData.toJSON() });
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Profile created successfully",
                data: result
            });
        });
        // login user/profile
        this.loginUser = (0, catchAsyncError_1.default)(async (req, res) => {
            const { credential, pin } = req.body;
            const result = await registration_proxy_1.default.loginUser(credential, pin);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Login successful",
                data: result
            });
        });
    }
}
exports.default = new RegistrationController();
