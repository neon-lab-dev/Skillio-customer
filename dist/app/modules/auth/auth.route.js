"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
router.post("/signup", multer_1.default, auth_controller_1.authControllers.createUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.LoginValidationSchema), auth_controller_1.authControllers.loginUser);
router.post("/refreshToken", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.authControllers.refreshToken);
exports.authRouter = router;
