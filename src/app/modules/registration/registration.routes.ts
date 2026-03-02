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
import { FetchProfileDetailsApi } from "./api/fetchProfileDetailsApi";
import { UpdateProfileApi } from "./api/updateProfileApi";
import { UpdateHiringRateApi } from "./api/updateHiringRateApi";
import { UpdatePinApi } from "./api/updatePinApi";

const router= Router();
const fetchProfilesApi= new FetchProfilesApi();
const fetchHiringRateApi= new FetchHiringRateApi();
const fetchProfileDetailsApi = new FetchProfileDetailsApi();
const updateProfileApi= new UpdateProfileApi();
const updateHiringRateApi = new UpdateHiringRateApi()
const updatePinApi= new UpdatePinApi();

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
    asyncApiHandler(updateProfileApi)
);
router.put(
    "/status" , 
    verifyToken , 
    authorizeRole.validateRole(roles.ADMIN) , 
    asyncApiHandler(updateProfileStatusApi)
);
router.get(
    "/hiringRate",
    verifyToken,
    asyncApiHandler(fetchHiringRateApi)
)
router.put(
    "/hiringRate",
    verifyToken,
    asyncApiHandler(updateHiringRateApi)
)
router.get(
    "/:id", 
    registrationController.getShortProfile
);

router.get(
    "/full/:id",
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    asyncApiHandler(fetchProfileDetailsApi)
)

router.get(
    "/" ,
    verifyToken , 
    createCriteriaMiddleWare(ProfileSearchCriteria , searchCriteriaBuilderFactory), 
    asyncApiHandler(fetchProfilesApi) 
)

router.put(
    "/pin",
    verifyToken,
    asyncApiHandler(updatePinApi)
)


export const registrationRoutes = router;