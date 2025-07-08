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
router.post("/", requireAuth_1.verifyToken, multer_1.default, (0, authorizeRole_1.authorizeRole)("ADMIN"), auth_controller_1.authControllers.createPeople);
router.get("/", auth_controller_1.authControllers.getAllPeople);
router.put("/:id", requireAuth_1.verifyToken, multer_1.default, (0, authorizeRole_1.authorizeRole)("ADMIN"), auth_controller_1.authControllers.updatePeople);
router.get("/:id", auth_controller_1.authControllers.getSinglePeople);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), auth_controller_1.authControllers.deletePeople);
exports.userRouter = router;
