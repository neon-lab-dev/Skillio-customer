import { globalMapper } from "../../../../mapper.global";
import { PaymentResponseDto } from "../../../../service/payment-proxy/models/dto.payment.response";
import { UserSubscriptionEntity } from "../../../entity/UserSubscriptionEntity";
import { InitiateUserSubscriptionResponse } from "./response.user.subscription";


export class InitiateUserSubscriptionBuilder {

    private constructor(){
        this.dto = new InitiateUserSubscriptionResponse();
    }

    private dto: InitiateUserSubscriptionResponse;

    public static builder(): InitiateUserSubscriptionBuilder {
        return new InitiateUserSubscriptionBuilder();
    }

    public of(
        entity: UserSubscriptionEntity, 
        paymentResponse: PaymentResponseDto): InitiateUserSubscriptionBuilder
    {
        this.dto = globalMapper.map(entity, UserSubscriptionEntity, InitiateUserSubscriptionResponse);
        this.dto.paymentLink = paymentResponse.fetchPaymentLink();
        return this;
    }

    public build(): InitiateUserSubscriptionResponse {
        return this.dto;
    }

}