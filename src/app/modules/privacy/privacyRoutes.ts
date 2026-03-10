import { Router } from "express";
import { UpdatePrivacyApi } from "./api/updatePrivacyApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { FetchPrivacyApi } from "./api/fetchPrivacyApi";

const router= Router();
const updatePrivacyApi= new UpdatePrivacyApi()
const fetchPrivacyApi= new FetchPrivacyApi()


router.get(
    "/",
    verifyToken,
    asyncApiHandler(fetchPrivacyApi)
)
router.put(
    "/",
    verifyToken, 
    asyncApiHandler(updatePrivacyApi)
)

export const privacyRouter= router;