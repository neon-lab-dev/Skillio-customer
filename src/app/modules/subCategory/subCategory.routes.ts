import { Router } from "express";
import { CreateSubCategoryApi } from "./api/createSubCategoryApi";
import { FetchSubCategoryApi } from "./api/fetchSubCategoryApi";
import { verifyToken } from "../../middlewares/requireAuth";
import authorizeRole from "../../middlewares/authorizeRole";
import { roles } from "../registration/enums/registrationEnum";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();

const createsubCategoryApi= new CreateSubCategoryApi();
const fetchSubCategoryApi = new FetchSubCategoryApi();

router.post(
    "/",
    verifyToken,
    authorizeRole.validateRole(roles.ADMIN),
    asyncApiHandler(createsubCategoryApi)
)

router.get(
    "/",
    asyncApiHandler(fetchSubCategoryApi)
)

export const subCategoryRouter = router;