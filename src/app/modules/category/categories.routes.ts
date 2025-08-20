import express from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { categoriesController } from "./categories.controller";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router = express.Router();


router.post('/',verifyToken, authorizeRole("ADMIN") ,  categoriesController.createCategory);
router.get('/', categoriesController.getAllCategories);
router.get('/:id',verifyToken, categoriesController.getCategoryById);
router.put('/:id',verifyToken,authorizeRole("ADMIN"),categoriesController.updateCategory);
router.delete('/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.deleteCategory);


export const categoriesRouter = router;