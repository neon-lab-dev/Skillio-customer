import express from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { verticlesController } from "./verticles.controller";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router = express.Router();


router.post('/' , verifyToken, authorizeRole("ADMIN"), verticlesController.createVerticle);
router.get('/', verticlesController.getAllVerticles);
router.get('/:id', verifyToken, verticlesController.getVerticleById);
router.put('/:id', verifyToken, authorizeRole("ADMIN"), verticlesController.updateVerticle);
router.delete('/:id', verifyToken, authorizeRole("ADMIN"), verticlesController.deleteVerticle);


export const verticlesRouter = router;