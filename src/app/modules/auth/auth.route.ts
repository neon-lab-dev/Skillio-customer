import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import {authControllers} from "./auth.controller";
import { authorizeRole } from "../../middlewares/authorizeRole";
import singleUpload from "../../middlewares/multer";

const router = express.Router();

router.post(
    "/signup",
    singleUpload,
    authControllers.createUser
);

router.post(
    "/login",
    validateRequest(AuthValidations.LoginValidationSchema),
    authControllers.loginUser
);

router.post(
    "/refreshToken",
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    authControllers.refreshToken
);

router.get(
    "/getAllUsers",
    authorizeRole("ADMIN"),
    authControllers.getAllUsers
)

router.get(
    "/getSingleUser/:id",
    authorizeRole("ADMIN"),
    authControllers.getSingleUser
)


export const authRouter = router;