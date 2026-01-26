import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdateActivePlanMaster } from "../models/request/dto.update.active.plan.master";
import { updateActivePlanMasterSchema } from "../models/schema/schema.plan.master.dto";
import { planMasterService } from "../service/service.plan.master";

export class BulkUpdateActivePlanMasterApi implements Api<UpdateActivePlanMaster, AppResponse> {
    
    async preprocess(req: UpdateActivePlanMaster): Promise<void> | never {
        updateActivePlanMasterSchema.parse(req);
    }
    
    async process(req: UpdateActivePlanMaster): Promise<AppResponse> {
        const response = await planMasterService.bulkActiveUpdate(req);
        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED,
            data: response
        };
    }

}