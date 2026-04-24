import { BaseRepository } from "@neon-lab-dev/platform";
import { UserSubscriptionEntity } from "../../entity/UserSubscriptionEntity";
import { AppDataSource } from "../../../db/dataSource";
import { In } from "typeorm";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";

export class UserSubscriptionRepository extends BaseRepository<UserSubscriptionEntity> {

    constructor() {
        super(AppDataSource, UserSubscriptionEntity);
    }

    async findByPorfileIdPlanCodeAndStatusIn(
        profileId: string,
        code: string,
        statuses: SubscriptionStatus[]
    ): Promise<UserSubscriptionEntity[]> {
        return await this.repository.findBy(
            {
                planCode: code,
                profileId: profileId,
                status: In([...statuses])
            }
        );
    }

    async fetchActiveUserSubscriptionsCount():Promise<number>{
        return await this.repository.count({
            where:{
                status: SubscriptionStatus.SUCCESS
            }
        })
    }

    
    async updateStatus(id: string){
        return await this.repository.update(id , {
            status: SubscriptionStatus.EXPIRED
        })
    }


}