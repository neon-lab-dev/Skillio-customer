import registrationController from "./registration.controller";
import { Router } from "express";

const router= Router();

router.post("/" , registrationController.createProfile);
router.post("/login" , registrationController.loginUser);

export const registrationRoutes = router;