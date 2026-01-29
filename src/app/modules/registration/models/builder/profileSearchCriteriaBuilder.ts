import { ProfileSearchCriteria } from "../request/searchCriteria/profileSearchCriteria";

export class ProfileSearchCriteriaBuilder {

    private constructor(){
        this.searchCriteria = new ProfileSearchCriteria();
    }

    private searchCriteria: ProfileSearchCriteria;

    public static builder(): ProfileSearchCriteriaBuilder{
        return new ProfileSearchCriteriaBuilder();
    }

    public of( query: Record<string, any> ): ProfileSearchCriteriaBuilder {
        this.searchCriteria.setDefault(query);
        this.searchCriteria.city= query.city;
        this.searchCriteria.country= query.country;
        this.searchCriteria.email= query.email;
        this.searchCriteria.ids=query.ids;
        this.searchCriteria.nickName= query.nickName;
        this.searchCriteria.phoneNumber=query.phoneNumber;
        this.searchCriteria.profileType= query.profileType;
        this.searchCriteria.proficiency= query.proficiency;
        return this;
    }

    public build(): ProfileSearchCriteria {
        return this.searchCriteria;
    }

}