import { AppError, ERROR_CODES, HTTP_STATUS, SearchCriteria, SearchCriteriaBuilderFactory } from "@neon-lab-dev/platform";
import { PlanMasterSearchCriteria } from "../planMaster/models/request/search.criteria.plan.master";
import { PlanMasterSearchCriteriaBuilder } from "./search.criteria.plan.master.builder";
import { UserPlanMasterSearchCriteria } from "../planMaster/models/request/search.criteria.user.plan.master";
import { ProfileSearchCriteria } from "../registration/models/request/searchCriteria/profileSearchCriteria";
import { ProfileSearchCriteriaBuilder } from "../registration/models/builder/profileSearchCriteriaBuilder";
import { NotificatinSearchCriteria } from "../notification/models/request/searchCriteria/notificationSearchCriteria";
import { NotificationSearchCriteriaBuilder } from "../notification/models/builders/builder.notification.serach.criteria";


class CriteriaBuilderFactory implements SearchCriteriaBuilderFactory {

    public build<T extends SearchCriteria>(raw: Record<string, string>, cls: new () => T): T {

        const ctor = cls as unknown as new () => SearchCriteria;
        if (ctor === PlanMasterSearchCriteria) {
            return PlanMasterSearchCriteriaBuilder
                .builder()
                .of(raw)
                .build() as unknown as T;
        }
        if ( ctor === UserPlanMasterSearchCriteria) {
            return PlanMasterSearchCriteriaBuilder
            .builder()
            .userSearch(raw)
            .build() as unknown as T;
        }

        if(ctor=== ProfileSearchCriteria){
            return ProfileSearchCriteriaBuilder
                .builder()
                .of(raw)
                .build() as unknown as T;
        }
        
        if(ctor=== NotificatinSearchCriteria){
            return NotificationSearchCriteriaBuilder
                .builder()
                .of(raw)
                .build() as unknown as T;
        }

        throw new AppError(
            ERROR_CODES.UNSUPPORTED_OPERATION,
            HTTP_STATUS.BAD_REQUEST,
            `Builder not found for ${cls.toString()}.`
        );
    }

}

export const searchCriteriaBuilderFactory = new CriteriaBuilderFactory();