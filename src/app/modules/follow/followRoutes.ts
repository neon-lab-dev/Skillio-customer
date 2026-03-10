import { Router } from "express";
import { CreateFollowApi } from "./api/createFollowApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { FetchFollowersApi } from "./api/fetchFollowersApi";
import { FetchFollowingApi } from "./api/fetchFollowingApi";
import { FetchCountApi } from "./api/fetchCountApi";

const router= Router();
const createFollowApi = new CreateFollowApi();
const fetchFollowersApi = new FetchFollowersApi();
const fetchFollowingApi = new FetchFollowingApi();
const fetchCountApi = new FetchCountApi();


router.post(
    "/",
    verifyToken,
    asyncApiHandler(createFollowApi)
)

router.get(
    "/followers",
    verifyToken,
    asyncApiHandler(fetchFollowersApi)
)

router.get(
    "/following",
    verifyToken,
    asyncApiHandler(fetchFollowingApi)
)

router.get(
    "/count",
    verifyToken, 
    asyncApiHandler(fetchCountApi)
)

export const followRouter= router;