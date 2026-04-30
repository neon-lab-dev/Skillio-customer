import { Router } from "express";
import { CreateSubCategoryApi } from "./api/createSubCategoryApi";
import { FetchSubCategoryApi } from "./api/fetchSubCategoryApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();

const createsubCategoryApi= new CreateSubCategoryApi();
const fetchSubCategoryApi = new FetchSubCategoryApi();

router.post(
    "/",
    verifyToken,
    asyncApiHandler(createsubCategoryApi)
)

router.get(
    "/",
    asyncApiHandler(fetchSubCategoryApi)
)

export const subCategoryRouter = router;