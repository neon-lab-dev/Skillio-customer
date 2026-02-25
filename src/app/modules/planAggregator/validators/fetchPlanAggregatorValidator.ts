import {  Validator } from "@neon-lab-dev/platform";
import { FetchPlanAggregatorRequestDto } from "../models/request/fetchPlanAggregatorRequestDto";
import { fetchPlanAggregatorSchema } from "../models/schema/planAggregatorSchema";

class FetchPlanAggregatorValidator implements Validator{
    async validate(req: FetchPlanAggregatorRequestDto): Promise<void> | never {
        fetchPlanAggregatorSchema.parse(req);
    }
}

export default new FetchPlanAggregatorValidator();