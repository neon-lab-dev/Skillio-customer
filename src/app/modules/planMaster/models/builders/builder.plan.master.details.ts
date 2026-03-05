import { PlanMasterEntity } from "../../../entity/PlanMasterEntity";
import { PlanMasterDetailsDto } from "../response/dto.plan.master.details";

export class PlanMasterDetailsBuilder {

    private constructor(){
        this.dto = new PlanMasterDetailsDto();
    }

    public static builder(): PlanMasterDetailsBuilder {
        return new PlanMasterDetailsBuilder();
    }

    private dto: PlanMasterDetailsDto;

    public build(): PlanMasterDetailsDto{
        return this.dto;
    }

    public of( entity: PlanMasterEntity ): PlanMasterDetailsBuilder {
        this.dto.id = entity.id;
        this.dto.code = entity.code;
        this.dto.description = entity.description;
        this.dto.type = entity.type;
        this.dto.profileVisibility = entity.profileVisibility;
        this.dto.priceInPaise = entity.priceInPaise;
        this.dto.callLimits = entity.callLimits;
        this.dto.chatLimits = entity.chatLimits;
        this.dto.validity = entity.validity;
        this.dto.version = entity.version;
        this.dto.status = entity.status;
        this.dto.priority = entity.priority;
        this.dto.active = entity.active;
        return this;
    }

    
    public ofArray(entities: PlanMasterEntity[]){
        return entities.map((entity)=> PlanMasterDetailsBuilder.builder().of(entity).build());
    }


}