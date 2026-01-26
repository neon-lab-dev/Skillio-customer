import { PlanMasterEntity } from "../../../entity/PlanMasterEntity";
import { ShortPlanMasterDto } from "../response/dto.short.plan.master.details";

export class ShortPlanMasterBuilder {

    private constructor() {
        this.dto = new ShortPlanMasterDto();
    }

    private dto: ShortPlanMasterDto;

    public static builder(): ShortPlanMasterBuilder {
        return new ShortPlanMasterBuilder();
    }

    public build(): ShortPlanMasterDto {
        return this.dto;
    }

    public of( entity: PlanMasterEntity): ShortPlanMasterBuilder {
        this.dto.id = entity.id;
        this.dto.code = entity.code;
        this.dto.description = entity.description;
        this.dto.type = entity.type;
        this.dto.version = entity.version;
        this.dto.priority = entity.priority;
        this.dto.priceInPaise = entity.priceInPaise;
        this.dto.active = entity.active;
        this.dto.status = entity.status;
        return this;
    }

    public static ofArray( entities: PlanMasterEntity[]) : ShortPlanMasterDto[] {
        return entities.map(e => ShortPlanMasterBuilder.builder().of(e).build());
    }
}