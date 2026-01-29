import { PaymentRequest } from "./dto.request.payment";



export class PaymentRequestBuilder {

    private constructor(){
        this.request = new PaymentRequest();
    }

    private request: PaymentRequest;

    public static builder(): PaymentRequestBuilder {
        return new PaymentRequestBuilder();
    }

    public of( amount: number, userReferenceId: string): PaymentRequestBuilder{
        this.request.amount = amount;
        this.request.provider = "RAZORPAY";
        this.request.service = "PAYMENT_LINK";
        this.request.userReferenceId = userReferenceId;
        return this;
    }

    public build(): PaymentRequest {
        return this.request;
    }

}