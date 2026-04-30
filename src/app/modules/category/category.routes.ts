import { Router } from "express";
import { CreateCategoryApi } from "./api/createCategoryApi";
import { FetchCategoriesApi } from "./api/fetchCategoriesApi";
import { verifyToken } from "../../middlewares/requireAuth";
import { asyncApiHandler } from "@neon-lab-dev/platform";

const router= Router();
const createCategoryApi= new CreateCategoryApi();
const fetchCategoriesApi = new FetchCategoriesApi();

router.post(
    "/",
    verifyToken,
    asyncApiHandler(createCategoryApi)
)

router.get(
    "/",
    asyncApiHandler(fetchCategoriesApi)
)

export const categoryRouter= router;