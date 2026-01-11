import { PlanMasterSearchCriteria } from "../planMaster/models/request/search.criteria.plan.master";


export class PlanMasterSearchCriteriaBuilder {

    private constructor(){
        this.searchCriteria = new PlanMasterSearchCriteria();
    }

    private searchCriteria: PlanMasterSearchCriteria;

    public static builder(): PlanMasterSearchCriteriaBuilder {
        return new PlanMasterSearchCriteriaBuilder();
    }

    public build(): PlanMasterSearchCriteria {
        return this.searchCriteria;
    }

    public of ( query: Record<string, any>): PlanMasterSearchCriteriaBuilder {
        this.searchCriteria.setDefault(query);
        this.searchCriteria.ids = query.ids;
        this.searchCriteria.codes = query.codes;
        this.searchCriteria.active = query.active ? Boolean(query.active) : undefined;
        this.searchCriteria.type = query.type;
        this.searchCriteria.profileVisibility = query.profileVisibility;
        this.searchCriteria.status = query.status;
        this.searchCriteria.priceInPaiseMax = Number(query.priceInPaiseMax);
        this.searchCriteria.priceInPaiseMin = Number(query.priceInPaiseMin);
        this.searchCriteria.validityMin = Number(query.validityMin);
        return this;
    }

}