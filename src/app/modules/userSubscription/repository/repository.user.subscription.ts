import { BaseRepository } from "@neon-lab-dev/platform";
import { UserSubscriptionEntity } from "../../entity/UserSubscriptionEntity";
import { AppDataSource } from "../../../db/dataSource";

export class UserSubscriptionRepository extends BaseRepository<UserSubscriptionEntity> {

    constructor(){
        super(AppDataSource, UserSubscriptionEntity);
    }

}