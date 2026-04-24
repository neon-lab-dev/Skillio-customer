import { Router } from "express";
import { FetchPlanAggregatorApi } from "./api/fetchPlanAggregatorApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();
const fetchPlanAggregatorApi = new FetchPlanAggregatorApi();

router.get(
    "/:profileId" , 
    verifyToken, 
    asyncApiHandler(fetchPlanAggregatorApi)
);

export const planAggregatorRoutes= router;

