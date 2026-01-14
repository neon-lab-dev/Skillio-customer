import registrationController from "./registration.controller";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LoginSchema, registrationSchema } from "./registration.validation";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "./enums/registrationEnum";
import { verifyToken } from "../../middlewares/requireAuth";

const router= Router();

router.post("/" ,validateRequest(registrationSchema), registrationController.createProfile);
router.post("/login",validateRequest(LoginSchema), registrationController.loginUser);
router.get("/count" , verifyToken , authorizeRole.validateRole(roles.ADMIN) , registrationController.getProfileCount);
router.get("/:id", registrationController.getProfile);
router.get("/" , verifyToken  ,authorizeRole.validateRole(roles.ADMIN), registrationController.getProfiles);

export const registrationRoutes = router;