import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdatePlanMasterRequestDto } from "../models/request/dto.update.plan.master";
import { planMasterService } from "../service/service.plan.master";

export class UpdatePlanMasterApi implements Api<UpdatePlanMasterRequestDto, AppResponse> {

    async preprocess(req: UpdatePlanMasterRequestDto): Promise<void> | never {
        await planMasterService.validateUpdate(req);
    }

    async process(req: UpdatePlanMasterRequestDto): Promise<AppResponse> {
        const response = await planMasterService.update(req);
        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED,
            data: response
        }
    }
}