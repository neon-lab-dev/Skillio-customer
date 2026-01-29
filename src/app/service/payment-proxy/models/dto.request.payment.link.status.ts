
export class PaymentLinkStatusRequest {

    constructor( referenceId: string, hard: boolean){
        this.referenceId = referenceId;
        this.hard = hard;
    }

    referenceId!: string;
    hard!: boolean;

}