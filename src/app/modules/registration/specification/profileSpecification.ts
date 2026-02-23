import { BaseSpecification, SearchCriteriaUtils } from "@neon-lab-dev/platform";
import { Profile } from "../../../entity/profile";
import { ProfileSearchCriteria } from "../models/request/searchCriteria/profileSearchCriteria";
import { SelectQueryBuilder } from "typeorm";
import { contactType } from "../enums/registrationEnum";

export class ProfileSpecification extends BaseSpecification<Profile>{

    constructor(
        criteria: ProfileSearchCriteria
    ){
        super('pro' , criteria)
    }

    private ID: string ='id';
    private nickName: string='nickName';
    private profileType: string= 'profileType'


    applyFilters(qb: SelectQueryBuilder<Profile>): void {
        const criteria= this.criteria as ProfileSearchCriteria

        this.applySelectiveJoins(qb);

        this.filterByIdsIn(criteria , qb);
        this.filterByNickaName(criteria ,qb);
        this.filterByEmail(criteria, qb);
        this.filterByPhoneNumber(criteria ,qb);
        this.filterByCity(criteria , qb);
        this.filterByCountry(criteria, qb);
        this.filterByProfileType(criteria , qb);
        this.filterByProficiency(criteria, qb);
        this.filterByCategory(criteria , qb);
        this.filterBySubCategory(criteria , qb)

    }

    private applySelectiveJoins(qb: SelectQueryBuilder<Profile>): void {
     qb.leftJoinAndSelect(`${this.alias}.address`, 'address')
      .leftJoinAndSelect(`${this.alias}.contacts`, 'contact')
      .leftJoinAndSelect(`${this.alias}.portfolio`, 'portfolio')
      .leftJoinAndSelect('portfolio.document' , 'document')
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
            `${this.alias}.${this.nickName} LIKE :nic`,
            {nic: criteria.nickName}
        )
    }

    private filterByEmail(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.email) return qb;

        return qb.andWhere(
            `contact.type= :contactType AND contact.value LIKE :emailVal`,
            {
                contactType: contactType.EMAIL,
                emailVal: criteria.email
            }
        )
    }

    private filterByPhoneNumber(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.phoneNumber) return qb;

        return qb.andWhere(
            `contact.type= :contactType AND contact.value LIKE :phoneNo`,
            {
                contactType: contactType.PHONE,
                phoneNo: criteria.phoneNumber
            }
        )
    }

    private filterByCity(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.city) return qb;

        return qb.andWhere(
            `address.city LIKE :city`,
            {
                city: criteria.city
            }
        )
    }

    private filterByCountry(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.country) return qb;

        return qb.andWhere(
            `address.country LIKE :country`,
            {
                country: criteria.country
            }
        )
    }

    private filterByProfileType(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.profileType) return qb;

        return qb.andWhere(
            `${this.alias}.${this.profileType}= :pType`,
            {
                pType: criteria.profileType
            }
        )
    }

    private filterByProficiency(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.proficiency) return qb;

        return qb.andWhere(
            `portfolio.proficiency = :prof`,
            {
                prof: criteria.proficiency
            }
        )
    }

    private filterByCategory(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.category) return qb;

        return qb.andWhere(
            `portfolio.category = :cat`,
            {
                cat: criteria.category
            }
        )
    }

    private filterBySubCategory(
        criteria: ProfileSearchCriteria,
        qb: SelectQueryBuilder<Profile>
    ): SelectQueryBuilder<Profile>{
        if(!criteria.subCategory) return qb;

        return qb.andWhere(
            `portfolio.subCategory= :subCat`,
            {
                subCat: criteria.subCategory
            }
        )
    }

}