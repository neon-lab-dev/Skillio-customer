
import { Router } from "express";
import { CreatePlanApi } from "./api/api.create";
import { UpdatePlanMasterApi } from "./api/api.update";
import { asyncApiHandler, createCriteriaMiddleWare } from "@neon-lab-dev/platform";
import { PlanMasterSearchCriteria } from "./models/request/search.criteria.plan.master";
import { searchCriteriaBuilderFactory } from "../searchCriteria/search.criteria.builder.factory";
import { FetchPlanApi } from "./api/api.fetch";
import { FetchByIdApi } from "./api/api.fetch.By.Id";
import { DeletePlanApi } from "./api/api.delete";
import { verifyToken } from "../../middlewares/requireAuth";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "../registration/enums/registrationEnum";
import { UserPlanMasterSearchCriteria } from "./models/request/search.criteria.user.plan.master";


const router = Router();
const createPlanApi = new CreatePlanApi();
const updatePlanApi = new UpdatePlanMasterApi();
const fetchPlanApi = new FetchPlanApi();
const fetchByIdApi= new FetchByIdApi();
const deletePlanApi= new DeletePlanApi();

router.post(
    "/",
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    asyncApiHandler(createPlanApi));
router.put(
    "/", 
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    asyncApiHandler(updatePlanApi));
router.get(
    "/",
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    createCriteriaMiddleWare(PlanMasterSearchCriteria, searchCriteriaBuilderFactory),
    asyncApiHandler(fetchPlanApi)
);
router.get(
    "/plans",
    verifyToken,
    createCriteriaMiddleWare(UserPlanMasterSearchCriteria, searchCriteriaBuilderFactory),
    asyncApiHandler(fetchPlanApi)
)
router.get("/:id" , asyncApiHandler(fetchByIdApi));
router.post("/delete" , asyncApiHandler(deletePlanApi));

export const planMasterRouter = router;
