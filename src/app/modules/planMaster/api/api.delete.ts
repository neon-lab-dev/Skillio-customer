import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { DeletePlanMasterDto } from "../models/request/dto.delete.plan.master";
import { AppResponse } from "@neon-lab-dev/platform";
import { planMasterService } from "../service/service.plan.master";

export class DeletePlanApi implements Api<DeletePlanMasterDto , AppResponse>{
    async preprocess(req: DeletePlanMasterDto): Promise<void> | never {
        planMasterService.validateDelete(req);
    }

    async process(req: DeletePlanMasterDto): Promise<AppResponse> {
        await planMasterService.delete(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.DELETED
        }
    }
} 