import express from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { categoriesController } from "./categories.controller";

const router = express.Router();


router.post('/category',verifyToken, categoriesController.createCategory);
router.get('/categories',verifyToken, categoriesController.getAllCategories);
router.get('/category/:id',verifyToken, categoriesController.getCategoryById);
router.put('/category/:id',verifyToken,categoriesController.updateCategory);
router.delete('/category/:id',verifyToken, categoriesController.deleteCategory);


export const categoriesRouter = router;