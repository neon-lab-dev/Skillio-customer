"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const categories_controller_1 = require("./categories.controller");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
router.post('/', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.createCategory);
router.get('/', requireAuth_1.verifyToken, categories_controller_1.categoriesController.getAllCategories);
router.get('/:id', requireAuth_1.verifyToken, categories_controller_1.categoriesController.getCategoryById);
router.put('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.updateCategory);
router.delete('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.deleteCategory);
exports.categoriesRouter = router;
