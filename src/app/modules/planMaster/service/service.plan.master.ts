import { AppError, AppValidationError, ERROR_CODES, JsonUtils, Loggable, LoggerService, NotFoundError, Page, Pageable, PartialUpdateUtil } from "@neon-lab-dev/platform";
import { CreatePlanMasterRequest } from "../models/request/dto.create.plan.master";
import { createPlanMasterSchema, updatePlanMasterSchema } from "../models/schema/schema.plan.master.dto";
import { PlanMasterRepository } from "../repository/repository.plan.master";
import { PlanMasterDetailsDto } from "../models/response/dto.plan.master.details";
import { PlanMasterEntityBuilder } from "../models/builders/builder.plan.master.entity";
import { PlanMasterDetailsBuilder } from "../models/builders/builder.plan.master.details";
import { UpdatePlanMasterRequestDto } from "../models/request/dto.update.plan.master";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { UpdateActivePlanMaster } from "../models/request/dto.update.active.plan.master";
import { UpdateActivePlanMasterResponse } from "../models/response/dto.update.active.plan.master";
import { PlanMasterStatus } from "../enum/PlanMasterStatus";
import { PlanMasterUpdateError } from "../models/response/dto.plan.master.update.error";
import { PlanMasterSearchCriteria } from "../models/request/search.criteria.plan.master";
import { ShortPlanMasterDto } from "../models/response/dto.short.plan.master.details";
import { PlanMasterSpecification } from "../repository/specification.plan.master";
import { ShortPlanMasterBuilder } from "../models/builders/builder.plan.master.short";
import { PlanType } from "../enum/PlanType";

class PlanMasterService {

    private repository: PlanMasterRepository = new PlanMasterRepository();

    @Loggable()
    public async validateCreate( req: CreatePlanMasterRequest ) {
        createPlanMasterSchema.parse(req);
        const existing:PlanMasterEntity[] | null = await this.repository.findFirstByCodeOrderByVersionDesc( req.code );
        if ( existing && existing.length == 1){
            throw new AppValidationError(`Plan Master already exists with code ${req.code}`, ERROR_CODES.DUPLICATE_ENTRY);
        }
    }

    @Loggable()
    public async create( req: CreatePlanMasterRequest ): Promise<PlanMasterDetailsDto> {
        let entity = PlanMasterEntityBuilder.builder()
            .create(req).build();
        await this.validateEntityStatusAndActive(entity);
        entity = await this.repository.create(entity);
        return PlanMasterDetailsBuilder.builder().of(entity).build();
    }

    @Loggable()
    public async validateUpdate( req: UpdatePlanMasterRequestDto) {
        updatePlanMasterSchema.parse(req);
        await this.fetchById(req.id);
    }

    @Loggable()
    public async update( req: UpdatePlanMasterRequestDto ): Promise<PlanMasterDetailsDto>{
        let entity = await this.fetchById(req.id);
        let partialEntity = JsonUtils.toPlain(req) as Partial<PlanMasterEntity>;
        entity = PartialUpdateUtil.apply(entity, partialEntity);
        await this.preUpdateValidation(entity);
        const saved = await this.repository.save(entity);
        return PlanMasterDetailsBuilder.builder().of(saved!).build();
    }

    //currently the below method is not in use. Kept this in case requirement comes in for such requirement.
    @Loggable()
    public async bulkActiveUpdate( req: UpdateActivePlanMaster ): Promise<UpdateActivePlanMasterResponse>{
        let retVal = new UpdateActivePlanMasterResponse(req.ids.size);
        for (let currentId of req.ids){
            try{
                let updateRequest = UpdatePlanMasterRequestDto.of(currentId, req.active);
                await this.update(updateRequest);
            } catch (e) {
                if (e instanceof AppError){
                    retVal.appendError(new PlanMasterUpdateError(currentId, e.message));
                } else {
                    retVal.appendError(new PlanMasterUpdateError(currentId, `Unknown Error`));
                }
            }
        }
        retVal.setSuccessCount();
        return retVal;
    }

    @Loggable()
    public async fetch( req: PlanMasterSearchCriteria): Promise<Page<ShortPlanMasterDto>> {
        const spec = new PlanMasterSpecification(req);
        const entityPage = await this.repository.findPage(spec, req);
        const dtoItems = ShortPlanMasterBuilder.ofArray(entityPage.items);
        return Pageable.buildPage(dtoItems, entityPage.total, req);
    }

    @Loggable()
    public async fetchById( id: string ): Promise<PlanMasterEntity>{
        let retVal = await this.repository.findById(id);
        if ( retVal ){
            return retVal;
        }
        throw new NotFoundError(`Plan Master not found with id ${id}`);
    }

    private async fetchAllSubscriptionByPriority( priority: number ): Promise<PlanMasterEntity[]> {
        return await this.repository.findAllSubscriptionByPriority( priority );
    }

    private async preUpdateValidation( entity: PlanMasterEntity ){
        await this.validatePriorityDuplication(entity);
        await this.validateEntityStatusAndActive(entity);
    }

    private async validatePriorityDuplication( entity: PlanMasterEntity ){
        if ( entity.type == PlanType.SUBSCRIPTION ) {
            if ( entity.priority > -1){ //filtering out default priorities or priorites not set case
                let recordsWithSamePriority = await this.fetchAllSubscriptionByPriority(entity.priority);
                if ( recordsWithSamePriority.length > 0 ) {
                    throw new AppValidationError(
                        `Priority for SUBSCRIPTION should be unique. Please check.`,
                        ERROR_CODES.UNSUPPORTED_OPERATION
                    );
                }
            }
        }
    }

    private async validateEntityStatusAndActive( entity : PlanMasterEntity ){
        if ( 
            entity.status === PlanMasterStatus.DRAFT &&
            entity.active
        ){
            throw new AppValidationError(
                `Plan Master is currently in DRAFT status. Please COMPLETE it before making it as active.`,
                 ERROR_CODES.UNSUPPORTED_OPERATION
            );
        }
    }

}

export const planMasterService = new PlanMasterService();