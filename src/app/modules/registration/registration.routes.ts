import registrationController from "./registration.controller";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LoginSchema, registrationSchema } from "./registration.validation";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "./enums/registrationEnum";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { createCriteriaMiddleWare } from "@neon-lab-dev/platform";
import { FetchProfilesApi } from "./api/fetchProfilesApi";
import { ProfileSearchCriteria } from "./models/request/searchCriteria/profileSearchCriteria";
import updateProfileStatusApi from "./api/updateProfileStatusApi";
import { searchCriteriaBuilderFactory } from "../searchCriteria/search.criteria.builder.factory";
import { FetchHiringRateApi } from "./api/fetchHiringRateApi";

const router= Router();
const fetchProfilesApi= new FetchProfilesApi();
const fetchHiringRateApi= new FetchHiringRateApi();

router.post(
    "/" ,
    validateRequest(registrationSchema), 
    registrationController.createProfile
);
router.post(
    "/login",
    validateRequest(LoginSchema), 
    registrationController.loginUser
);
router.put(
    "/" , 
    verifyToken , 
    authorizeRole.validateRole(roles.ADMIN) , 
    asyncApiHandler(updateProfileStatusApi)
);
router.get(
    "/count" , 
    verifyToken , 
    authorizeRole.validateRole(roles.ADMIN) , 
    registrationController.getProfileCount
);
router.get(
    "/hiringRate",
    verifyToken,
    asyncApiHandler(fetchHiringRateApi)
)
router.get(
    "/:id", 
    registrationController.getProfile
);
router.get(
    "/" ,
    verifyToken , 
    authorizeRole.validateRole(roles.ADMIN) ,
    createCriteriaMiddleWare(ProfileSearchCriteria , searchCriteriaBuilderFactory), 
    asyncApiHandler(fetchProfilesApi) 
)

export const registrationRoutes = router;