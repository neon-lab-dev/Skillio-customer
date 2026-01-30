import { BaseRepository } from "@neon-lab-dev/platform";
import { UserSubscriptionEntity } from "../../entity/UserSubscriptionEntity";
import { AppDataSource } from "../../../db/dataSource";
import { In } from "typeorm";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";

export class UserSubscriptionRepository extends BaseRepository<UserSubscriptionEntity> {

    constructor() {
        super(AppDataSource, UserSubscriptionEntity);
    }

    async findByPortfolioIdPlanCodeAndStatusIn(
        polioId: string,
        code: string,
        statuses: SubscriptionStatus[]
    ): Promise<UserSubscriptionEntity[]> {
        return await this.repository.findBy(
            {
                planCode: code,
                portfolio: { id: polioId },
                status: In([...statuses])
            }
        );
    }


}