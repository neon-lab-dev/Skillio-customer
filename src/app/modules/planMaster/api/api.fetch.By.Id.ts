import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { AppResponse } from "@neon-lab-dev/platform";
import { planMasterService } from "../service/service.plan.master";
import { fetchByIdRequestDto } from "../models/request/dto.fetch.By.Id.plan.master";

export class FetchByIdApi implements Api<fetchByIdRequestDto , AppResponse>{
    async preprocess(req: fetchByIdRequestDto):  Promise<void> | never {
        await planMasterService.validateFetchById(req);
    }

    async process(req: fetchByIdRequestDto): Promise<AppResponse> {
        const res= await planMasterService.fetchById(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}
