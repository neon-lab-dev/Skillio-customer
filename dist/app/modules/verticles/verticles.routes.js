"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verticlesRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const verticles_controller_1 = require("./verticles.controller");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
router.post('/', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), verticles_controller_1.verticlesController.createVerticle);
router.get('/', verticles_controller_1.verticlesController.getAllVerticles);
router.get('/:id', requireAuth_1.verifyToken, verticles_controller_1.verticlesController.getVerticleById);
router.put('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), verticles_controller_1.verticlesController.updateVerticle);
router.delete('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), verticles_controller_1.verticlesController.deleteVerticle);
exports.verticlesRouter = router;
