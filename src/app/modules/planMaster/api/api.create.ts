import { Api, AppResponse, HTTP_STATUS, Loggable, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { planMasterService } from "../service/service.plan.master";
import { CreatePlanMasterRequest } from "../models/request/dto.create.plan.master";


export class CreatePlanApi implements Api<CreatePlanMasterRequest, AppResponse> {


    @Loggable()
    async preprocess(req: CreatePlanMasterRequest): Promise<void> | never {
        await planMasterService.validateCreate(req);
    }

    @Loggable()
    async process(req: CreatePlanMasterRequest): Promise<AppResponse> {
        const response = await planMasterService.create(req);
        return {
            status: HTTP_STATUS.CREATED,
            message: RESPONSE_MESSAGES.CREATED,
            data: response
        }
    }

    
}