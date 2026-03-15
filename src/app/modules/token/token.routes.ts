import { Router } from "express";
import { FetchTokenApi } from "./api/fetchTokenApi";
import { asyncApiHandler } from "@neon-lab-dev/platform";
import { CreateOrUpdateApi } from "./api/createOrUpdateApi";

const router= Router();
const createOrUpdateApi = new CreateOrUpdateApi();
const fetchTokenApi = new FetchTokenApi();

router.post(
    "/",
    asyncApiHandler(createOrUpdateApi)
)

router.get(
    "/",
    asyncApiHandler(fetchTokenApi)
)

export const tokenRouter= router;