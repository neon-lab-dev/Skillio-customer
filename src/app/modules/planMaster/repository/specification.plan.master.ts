import { BaseSpecification, SearchCriteriaUtils } from "@neon-lab-dev/platform";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { SelectQueryBuilder } from "typeorm";
import { PlanMasterSearchCriteria } from "../models/request/search.criteria.plan.master";


export class PlanMasterSpecification extends BaseSpecification<PlanMasterEntity> {

    constructor(
        criteria: PlanMasterSearchCriteria
    ) {
        super('plm', criteria);
    }

    private ID: string = 'id';
    private CODE: string = 'code';
    private PRICE_IN_PAISE: string = "priceInPaise";
    private VALIDITY: string = "validity";
    private ACTIVE: string = "active";
    private PROFILEVISIBILITY: string = "profileVisibility";
    private TYPE: string = "type";
    private STATUS: string = "status";

    applyFilters(qb: SelectQueryBuilder<PlanMasterEntity>): void { 
        const criteria = this.criteria as PlanMasterSearchCriteria;
        this.filterByIdsIn(criteria, qb);
        this.filterByCodesIn(criteria, qb);
        this.filterByActive(criteria, qb);
        this.filterByPriceInPaiseMax(criteria, qb);
        this.filterByPriceInPaiseMin(criteria, qb);
        this.filterByValidityMin(criteria, qb);
        this.filterByProfileVisibility(criteria, qb);
        this.filterByStatus(criteria, qb);
        this.filterByType(criteria, qb);
    
    }

    private filterByIdsIn(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {
        if (!criteria.ids) return qb;
        const idSet = SearchCriteriaUtils.toStringSet(criteria.ids);
        if (!idSet || idSet.size === 0) return qb;
        return qb.andWhere(
            `${this.alias}.${this.ID} IN (:...allIds)`,
            { allIds : Array.from(idSet) }
        );
    }

    private filterByCodesIn(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {
        if (!criteria.codes) return qb;
        const codeSet = SearchCriteriaUtils.toStringSet(criteria.codes);
        if (!codeSet || codeSet.size === 0) return qb;
        return qb.andWhere(
            `${this.alias}.${this.CODE} IN (:...allCodes)`,
            { allCodes : Array.from(codeSet) }
        );
    }

    private filterByPriceInPaiseMax(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.priceInPaiseMax) return qb;
        return qb.andWhere(
            `${this.alias}.${this.PRICE_IN_PAISE} <= :pip`,
            { pip: criteria.priceInPaiseMax }
        );
    }

    private filterByPriceInPaiseMin(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.priceInPaiseMin) return qb;
        return qb.andWhere(
            `${this.alias}.${this.PRICE_IN_PAISE} >= :pip`,
            { pip: criteria.priceInPaiseMin }
        );
    }

    private filterByValidityMin(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.validityMin) return qb;
        return qb.andWhere(
            `${this.alias}.${this.VALIDITY} >= :val`,
            { val: criteria.validityMin }
        );
    }

    private filterByActive(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.active) return qb;
        return qb.andWhere(
            `${this.alias}.${this.ACTIVE} = :act`,
            { act: criteria.active }
        );
    }

    private filterByType(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.type) return qb;
        return qb.andWhere(
            `${this.alias}.${this.TYPE} = :ty`,
            { ty: criteria.type }
        );
    }

    private filterByProfileVisibility(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.profileVisibility) return qb;
        return qb.andWhere(
            `${this.alias}.${this.PROFILEVISIBILITY} = :pv`,
            { pv: criteria.profileVisibility }
        );
    }

    private filterByStatus(
        criteria: PlanMasterSearchCriteria,
        qb: SelectQueryBuilder<PlanMasterEntity>
    ): SelectQueryBuilder<PlanMasterEntity> {

        if (!criteria.status) return qb;
        return qb.andWhere(
            `${this.alias}.${this.STATUS} = :st`,
            { st: criteria.status }
        );
    }
}