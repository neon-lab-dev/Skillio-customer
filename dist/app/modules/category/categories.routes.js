"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const categories_controller_1 = require("./categories.controller");
const router = express_1.default.Router();
router.post('/category', requireAuth_1.verifyToken, categories_controller_1.categoriesController.createCategory);
router.get('/categories', requireAuth_1.verifyToken, categories_controller_1.categoriesController.getAllCategories);
router.get('/category/:id', requireAuth_1.verifyToken, categories_controller_1.categoriesController.getCategoryById);
router.put('/category/:id', requireAuth_1.verifyToken, categories_controller_1.categoriesController.updateCategory);
router.delete('/category/:id', requireAuth_1.verifyToken, categories_controller_1.categoriesController.deleteCategory);
exports.categoriesRouter = router;
