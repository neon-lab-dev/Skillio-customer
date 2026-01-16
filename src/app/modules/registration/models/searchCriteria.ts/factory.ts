import { SearchCriteria } from "@neon-lab-dev/platform";
import { AppError } from "@neon-lab-dev/platform";
import { ERROR_CODES } from "@neon-lab-dev/platform";
import { ProfileSearchCriteria } from "./profileSearchCriteria";
import { HTTP_STATUS } from "@neon-lab-dev/platform";
import { ProfileSearchCriteriaBuilder } from "../builder/profileSearchCriteriaBuilder";


export class SearchCriteriaFactory {

    static fromRequest (
        raw: Record<string, string>,
        cls: new () => SearchCriteria
    ): SearchCriteria {

        switch (cls) {

            case ProfileSearchCriteria:
                return ProfileSearchCriteriaBuilder.builder().of(raw).build() as SearchCriteria;

            default:
                throw new AppError(ERROR_CODES.UNSUPPORTED_OPERATION, HTTP_STATUS.BAD_REQUEST, `Builder not found for ${cls.toString()}`)
        }


    }

}