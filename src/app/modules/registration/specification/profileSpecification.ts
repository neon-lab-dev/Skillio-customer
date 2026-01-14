import { BaseSpecification, SearchCriteriaUtils } from "@neon-lab-dev/platform";
import { ProfileSearchCriteria } from "../models/request/profileSearchCriteria";
import { Profile } from "../../../entity/profile";
import { SelectQueryBuilder } from "typeorm";

export class ProfileSpecification extends BaseSpecification<Profile>{

    constructor(
        criteria: ProfileSearchCriteria
    ){
        super('pro' , criteria)
    }

    private ID: string ='id';
    private nickName: string='nickName';


    applyFilters(qb: SelectQueryBuilder<Profile>): void {
        const criteria= this.criteria as ProfileSearchCriteria
    }

    private filterByIdsIn(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.ids) return qb;
        const idSet= SearchCriteriaUtils.toStringSet(criteria.ids);
        if(!idSet || idSet.size ===0) return qb;
        
        return qb.andWhere(
            `${this.alias}.${this.ID} IN (:...allIds)`,
            {allIds: Array.from(idSet)}
        )
    }

    private filterByNickaName(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.nickName) return qb;
        
        return qb.andWhere(
            `${this.alias}.${this.nickName} = :nic`,
            {nic: criteria.nickName}
        )
    }

}