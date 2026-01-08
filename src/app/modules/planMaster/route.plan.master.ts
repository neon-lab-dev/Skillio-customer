import { asyncApiHandler } from "@neon-lab-dev/platform";
import { Router } from "express";
import { CreatePlanApi } from "./api/api.create";


const router = Router();
const createPlanApi = new CreatePlanApi();

router.post("/", asyncApiHandler(createPlanApi));
