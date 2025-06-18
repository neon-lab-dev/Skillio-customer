"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../auth/auth.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.authControllers.getAllUsers);
router.put("/:id", multer_1.default, auth_controller_1.authControllers.updateUser);
router.get("/:id", auth_controller_1.authControllers.getSingleUser);
router.delete("/:id", auth_controller_1.authControllers.deleteUser);
exports.userRouter = router;
