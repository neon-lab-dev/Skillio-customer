import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { InitiateUserSubscriptionApi } from "./api/api.initiate.user.subscription";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { FetchNonTerminalSubscriptionApi } from "./api/api.fetch.non.terminal.subscription";
import { SyncSubscriptionStatusApi } from "./api/api.sync.subscription.status";


const router = Router();
const initiateUserSubscriptionApi = new InitiateUserSubscriptionApi();
const fetchNonTerminalSubscriptionApi = new FetchNonTerminalSubscriptionApi();
const syncSubscriptionStatusApi = new SyncSubscriptionStatusApi();

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
router.patch(
    "/status",
    verifyToken,
    asyncApiHandler(syncSubscriptionStatusApi)
);

export const userSubscriptionRouter = router;