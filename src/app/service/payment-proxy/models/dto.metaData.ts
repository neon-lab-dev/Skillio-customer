import { Expose } from "class-transformer";

export class MetaDataDto {

    @Expose()
    paymentLinkId!: string;
    @Expose()
    shortUrl!: string;
    @Expose()
    shortUrlStatus!: string;
    
    public fetchPaymentLink(): string {
        return this.shortUrl;
    }
}