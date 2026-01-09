import { Api, AppResponse, Loggable } from "@neon-lab-dev/platform";
import { PlanMasterDetailsDto } from "../models/dto.plan.master.details";


export class CreatePlanApi implements Api<PlanMasterDetailsDto, AppResponse> {


    @Loggable()
    async preprocess(req: PlanMasterDetailsDto): Promise<void> | never {
        throw new Error("Method not implemented.");
    }

    @Loggable()
    async process(req: PlanMasterDetailsDto): Promise<AppResponse> {
        throw new Error("Method not implemented.");
    }

    
}