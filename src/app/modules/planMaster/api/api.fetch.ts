import { Api, AppResponse, HTTP_STATUS, Loggable, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { PlanMasterSearchCriteria } from "../models/request/search.criteria.plan.master";
import { planMasterService } from "../service/service.plan.master";

export class FetchPlanApi implements Api<PlanMasterSearchCriteria, AppResponse> {
    
    @Loggable()
    async preprocess(req: PlanMasterSearchCriteria): Promise<void> | never {
        //ignore
    }
    
    @Loggable()
    async process(req: PlanMasterSearchCriteria): Promise<AppResponse> {
        const response = await planMasterService.fetch(req);
        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: response
        }
    }

}