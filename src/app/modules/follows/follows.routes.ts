import { Router } from "express"
import { CreateFollowsApi } from "./api/createFollowsApi"
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();
const createFollowsApi= new CreateFollowsApi();


router.post(
    "/",
    verifyToken,
    asyncApiHandler(createFollowsApi)
)

export const followsRouter= router;