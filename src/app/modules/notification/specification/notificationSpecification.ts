import { BaseSpecification } from "@neon-lab-dev/platform";
import { NotificatinSearchCriteria } from "../models/request/searchCriteria/notificationSearchCriteria";
import { Notification } from "../../../entity/notification";
import { SelectQueryBuilder } from "typeorm";

export class NotificationSpecification extends BaseSpecification<Notification>{
    constructor(
        criteria: NotificatinSearchCriteria
    ){
        super('noti' , criteria)
    }

    private to: string= 'to'

    applyFilters(qb: SelectQueryBuilder<Notification>): void {
        const criteria= this.criteria as NotificatinSearchCriteria;

        this.filterByProfileId(criteria , qb);
    }

    private filterByProfileId(
        criteria: NotificatinSearchCriteria,
        qb: SelectQueryBuilder<Notification>
    ): SelectQueryBuilder<Notification>{
        if(!criteria.profileId) return qb;

        return qb.andWhere(
            `${this.alias}.${this.to} = :pfid`,
            {pfid: criteria.profileId}
        )
    }

}