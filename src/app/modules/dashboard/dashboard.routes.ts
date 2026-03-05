import { Router } from "express";
import { FetchDashboardStatisticsApi } from "./api/fetchDashboardStatisticsApi";
import { verifyToken } from "../../middlewares/requireAuth";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "../registration/enums/registrationEnum";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();
const fetchDashboardStatisticsApi = new FetchDashboardStatisticsApi();

router.get(
    "/",
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    asyncApiHandler(fetchDashboardStatisticsApi)
)

export const dashboardRouter= router;