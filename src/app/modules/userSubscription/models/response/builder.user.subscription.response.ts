import { globalMapper } from "../../../../mapper.global";
import { UserSubscriptionEntity } from "../../../entity/UserSubscriptionEntity";
import { UserSubscriptionResponse } from "./response.user.subscription";


export class UserSubscriptionBuilder {

    private constructor(){
        this.dto = new UserSubscriptionResponse();
    }

    private dto: UserSubscriptionResponse;

    public static builder(): UserSubscriptionBuilder {
        return new UserSubscriptionBuilder();
    }

    public of(entity: UserSubscriptionEntity): UserSubscriptionBuilder
    {
        this.dto = globalMapper.map(entity, UserSubscriptionEntity, UserSubscriptionResponse);
        this.dto.status = entity.status;
        return this;
    }

    public build(): UserSubscriptionResponse {
        return this.dto;
    }

}