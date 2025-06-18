import express from "express";
import { authControllers } from "../auth/auth.controller";
import singleUpload from "../../middlewares/multer";

const router = express.Router();

router.get(
    "/",
    authControllers.getAllUsers
)
router.put(
    "/:id",
    singleUpload,
    authControllers.updateUser
);

router.get(
    "/:id",
    authControllers.getSingleUser
)

router.delete(
    "/:id",
    authControllers.deleteUser
)


export const userRouter = router;