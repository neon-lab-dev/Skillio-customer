import { AppResponseData } from "@neon-lab-dev/platform";
import { MetaDataDto } from "./dto.metaData";
import { Expose, Type } from "class-transformer";

export class PaymentResponseDto implements AppResponseData{

    @Expose()
    id!: string;
    @Expose()
    amount!: number;
    @Expose()
    @Type(() => MetaDataDto)
    metaData!: MetaDataDto;

    public fetchPaymentLink(): string {
        return this.metaData?.fetchPaymentLink() ?? null;
    }

}