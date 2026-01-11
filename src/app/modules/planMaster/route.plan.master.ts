
import { Router } from "express";
import { CreatePlanApi } from "./api/api.create";
import { UpdatePlanMasterApi } from "./api/api.update";
import { asyncApiHandler, createCriteriaMiddleWare } from "@neon-lab-dev/platform";
import { PlanMasterSearchCriteria } from "./models/request/search.criteria.plan.master";
import { searchCriteriaBuilderFactory } from "../searchCriteria/search.criteria.builder.factory";
import { FetchPlanApi } from "./api/api.fetch";


const router = Router();
const createPlanApi = new CreatePlanApi();
const updatePlanApi = new UpdatePlanMasterApi();
const fetchPlanApi = new FetchPlanApi();

router.post("/", asyncApiHandler(createPlanApi));
router.put("/", asyncApiHandler(updatePlanApi));
router.get(
    "/",
    createCriteriaMiddleWare(PlanMasterSearchCriteria, searchCriteriaBuilderFactory),
    asyncApiHandler(fetchPlanApi)
);

export const planMasterRouter = router;
