import registrationController from "./registration.controller";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LoginSchema, registrationSchema } from "./registration.validation";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "./enums/registrationEnum";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { createCriteriaMiddleware } from "../../middlewares/middlewre.create.criteria";
import fetchProfilesApi from "./api/fetchProfilesApi";
import { ProfileSearchCriteria } from "./models/searchCriteria.ts/profileSearchCriteria";
import updateProfileStatusApi from "./api/updateProfileStatusApi";

const router= Router();

router.post("/" ,validateRequest(registrationSchema), registrationController.createProfile);
router.post("/login",validateRequest(LoginSchema), registrationController.loginUser);
router.put("/" , verifyToken , authorizeRole.validateRole(roles.ADMIN) , asyncApiHandler(updateProfileStatusApi));
router.get("/count" , verifyToken , authorizeRole.validateRole(roles.ADMIN) , registrationController.getProfileCount);
router.get("/:id", registrationController.getProfile);
router.get("/" ,verifyToken , authorizeRole.validateRole(roles.ADMIN) ,createCriteriaMiddleware(ProfileSearchCriteria), asyncApiHandler(fetchProfilesApi) )

export const registrationRoutes = router;