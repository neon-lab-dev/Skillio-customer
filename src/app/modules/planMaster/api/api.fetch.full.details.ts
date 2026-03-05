import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { PlanMasterSearchCriteria } from "../models/request/search.criteria.plan.master";
import { planMasterService } from "../service/service.plan.master";

export class FetchFullPlanDetailsApi implements Api<PlanMasterSearchCriteria , AppResponse>{
    async preprocess(req: PlanMasterSearchCriteria): Promise<void> | never {
        
    }

    async process(req: PlanMasterSearchCriteria): Promise<AppResponse> {
        const res= await planMasterService.fetchFullDetails(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}