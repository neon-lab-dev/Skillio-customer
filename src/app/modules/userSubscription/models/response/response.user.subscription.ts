import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanDetails } from "../dto/dto.plan.details";
import { SubscriptionStatus } from "../../enums/SubscriptionStatus";
import { AutoMap } from "@automapper/classes";

export class InitiateUserSubscriptionResponse implements AppResponseData {

    @AutoMap()
    id!:string;
    @AutoMap()
    planCode!:string;
    @AutoMap()
    planDetails!: PlanDetails;
    @AutoMap()
    status!: SubscriptionStatus;
    @AutoMap()
    paymentLink!: string;
    @AutoMap()
    startDate!: Date;
    @AutoMap()
    endDate!: Date;
    @AutoMap()
    createdAt!:Date;
    @AutoMap()
    updatedAt!:Date;

}