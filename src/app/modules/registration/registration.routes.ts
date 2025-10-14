import registrationController from "./registration.controller";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LoginSchema, registrationSchema } from "./registration.validation";

const router= Router();

router.post("/" ,validateRequest(registrationSchema), registrationController.createProfile);
router.post("/login",validateRequest(LoginSchema), registrationController.loginUser);
router.get("/:id", registrationController.getProfile);
router.get("/" , registrationController.getProfiles);

export const registrationRoutes = router;