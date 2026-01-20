import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanDetails } from "../dto/dto.plan.details";

export class CreateUserSubscriptionResponse implements AppResponseData {

    id!:string;
    planCode!:string;
    planDetails!: PlanDetails;
    startDate!: Date;
    endDate!: Date;
    createdAt!:Date;
    updatedAt!:Date;

}