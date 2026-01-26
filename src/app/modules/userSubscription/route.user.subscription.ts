import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { InitiateUserSubscriptionApi } from "./api/api.initiate.user.subscription";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { FetchNonTerminalSubscriptionApi } from "./api/api.fetch.non.terminal.subscription";


const router = Router();
const initiateUserSubscriptionApi = new InitiateUserSubscriptionApi();
const fetchNonTerminalSubscriptionApi = new FetchNonTerminalSubscriptionApi();

router.post(
    "/",
    verifyToken,
    asyncApiHandler(initiateUserSubscriptionApi)
);
router.get(
    "/",
    verifyToken,
    asyncApiHandler(fetchNonTerminalSubscriptionApi)
);

export const userSubscriptionRouter = router;