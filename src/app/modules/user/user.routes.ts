import express from "express";
import { authControllers } from "../auth/auth.controller";
import singleUpload from "../../middlewares/multer";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyToken } from "../../middlewares/requireAuth";

const router = express.Router();

router.get(
    "/",
    verifyToken,
    authorizeRole("ADMIN"),
    authControllers.getAllUsers,
)
router.put(
    "/:id",
    verifyToken,
    singleUpload,
    authControllers.updateUser
);

router.get(
    "/:id",
    verifyToken,
    authControllers.getSingleUser
)

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("ADMIN"),
    authControllers.deleteUser,
)


export const userRouter = router;