import express from "express";
import { authControllers } from "../auth/auth.controller";
import singleUpload from "../../middlewares/multer";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyToken } from "../../middlewares/requireAuth";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    singleUpload,
    authorizeRole("ADMIN"),
    authControllers.createPeople
)

router.get(
    "/",
    authControllers.getAllPeople,
)
router.put(
    "/:id",
    verifyToken,
    singleUpload,
    authorizeRole("ADMIN"),
    authControllers.updatePeople
);

router.get(
    "/:id",
    authControllers.getSinglePeople
)

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("ADMIN"),
    authControllers.deletePeople,
)


export const userRouter = router;