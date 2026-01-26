import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { InitiateUserSubscriptionApi } from "./api/api.initiate.user.subscription";
import { asyncApiHandler } from "@neon-lab-dev/platform";


const router = Router();
const initiateUserSubscriptionApi = new InitiateUserSubscriptionApi();

router.post(
    "/",
    verifyToken,
    asyncApiHandler(initiateUserSubscriptionApi)
);

export const userSubscriptionRouter = router;