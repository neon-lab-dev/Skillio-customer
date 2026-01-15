import { BaseRepository, SortDirection } from "@neon-lab-dev/platform";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { AppDataSource } from "../../../db/dataSource";
import { In } from "typeorm";
import { PlanType } from "../enum/PlanType";

export class PlanMasterRepository extends BaseRepository<PlanMasterEntity> {

    constructor(){
        super(AppDataSource, PlanMasterEntity);
    }

    async findFirstByCodeOrderByVersionDesc( planCode: string ): Promise<PlanMasterEntity[] | null>{
        return await this.repository.find(
            {
                where: {
                    code:planCode
                },
                order:{
                    version: SortDirection.DESC
                },
                take: 1
            }
        );
    }

    async findAllByIdIn( ids: Set<string>): Promise<PlanMasterEntity[]> {
        return this.repository.findBy({
            id: In([...ids])
        });
    }

    async findAllSubscriptionByPriority( p: number ): Promise<PlanMasterEntity[]> {
        return this.repository.findBy(
            {
                type: PlanType.SUBSCRIPTION,
                priority: p
            }
        );
    }


}