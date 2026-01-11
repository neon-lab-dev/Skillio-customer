import { PlanMasterEntity } from "../../../entity/PlanMasterEntity";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";
import { CreatePlanMasterRequest } from "../request/dto.create.plan.master";


export class PlanMasterEntityBuilder {

    private constructor(){
        this.entity = new PlanMasterEntity();
    }

    private entity: PlanMasterEntity;

    public static builder(): PlanMasterEntityBuilder {
        return new PlanMasterEntityBuilder();
    }

    public create( dto: CreatePlanMasterRequest ): PlanMasterEntityBuilder {
        this.entity.code = dto.code;
        this.entity.description = dto.description;
        this.entity.type = dto.type;
        this.entity.priceInPaise = dto.priceInPaise;
        this.entity.callLimits = dto.callLimits;
        this.entity.chatLimits = dto.chatLimits;
        this.entity.validity = dto.validity;
        this.entity.status = dto.status ?? PlanMasterStatus.DRAFT;
        this.entity.active = dto.active ?? false;
        return this;
    }

    public build(): PlanMasterEntity {
        return this.entity;
    }

}