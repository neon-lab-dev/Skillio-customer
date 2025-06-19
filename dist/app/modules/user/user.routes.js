"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../auth/auth.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const requireAuth_1 = require("../../middlewares/requireAuth");
const router = express_1.default.Router();
router.get("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), auth_controller_1.authControllers.getAllUsers);
router.put("/:id", requireAuth_1.verifyToken, multer_1.default, auth_controller_1.authControllers.updateUser);
router.get("/:id", requireAuth_1.verifyToken, auth_controller_1.authControllers.getSingleUser);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), auth_controller_1.authControllers.deleteUser);
exports.userRouter = router;
