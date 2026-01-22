import { AppRequest, SearchCriteria } from "@neon-lab-dev/platform";

export class NotificatinSearchCriteria extends SearchCriteria implements AppRequest{
    constructor(){
        super();
    }

    profileId!: string;
}