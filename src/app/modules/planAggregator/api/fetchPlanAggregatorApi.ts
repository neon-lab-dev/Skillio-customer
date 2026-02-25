import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchPlanAggregatorRequestDto } from "../models/request/fetchPlanAggregatorRequestDto";
import { AppResponse } from "@neon-lab-dev/platform";
import fetchPlanAggregatorValidator from "../validators/fetchPlanAggregatorValidator";
import planAggregatorService from "../planAggregator.service";

export class FetchPlanAggregatorApi implements Api<FetchPlanAggregatorRequestDto , AppResponse>{
    async preprocess(req: FetchPlanAggregatorRequestDto):  Promise<void> | never {
        fetchPlanAggregatorValidator.validate(req);
    }

    async process(req: FetchPlanAggregatorRequestDto): Promise<AppResponse> {
        const res= await planAggregatorService.fetch(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data:res
        }
    }
}