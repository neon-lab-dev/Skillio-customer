import { PlanDetails } from "../dto/dto.plan.details";

export class PlanDetailsBuilder {


    constructor(){
        this.details = new PlanDetails();
    }

    private details: PlanDetails;

    public static builder(): PlanDetailsBuilder {
        return new PlanDetailsBuilder();
    }

    public build(): PlanDetails {
        return this.details;
    }

}