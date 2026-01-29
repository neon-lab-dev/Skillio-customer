import { NotificatinSearchCriteria } from "../request/searchCriteria/notificationSearchCriteria";

export class NotificationSearchCriteriaBuilder{
    private searchCriteria: NotificatinSearchCriteria;

    private constructor(){
        this.searchCriteria= new NotificatinSearchCriteria()
    }

    public static builder(): NotificationSearchCriteriaBuilder{
        return new NotificationSearchCriteriaBuilder();
    }


    public of( query: Record<string, any> ): NotificationSearchCriteriaBuilder {
        this.searchCriteria.setDefault(query);

        this.searchCriteria.profileId= query.profileId
        return this;
    }
    
    public build(): NotificatinSearchCriteria {
        return this.searchCriteria;
    }
}