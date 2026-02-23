import { AppRequest } from "@neon-lab-dev/platform";
import { SearchCriteria } from "@neon-lab-dev/platform";
import { proficiecy, ProfileType } from "../../../enums/registrationEnum";

export class ProfileSearchCriteria extends SearchCriteria implements AppRequest{
    constructor(){
        super();
    }

    ids!: Set<string>;

    nickName!: string;

    email!: string;

    phoneNumber!: string;

    city!: string;

    country!: string;

    profileType!: ProfileType;

    proficiency!: proficiecy;

    category!: string;

    subCategory!: string;

}