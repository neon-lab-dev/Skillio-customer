import { HiringRate } from "../../../../entity/hiringRate";
import { HiringRateDto} from "../dto/dto.hiringRate"

export class HiringRateDtoBuilder{
    private dto: HiringRateDto;

    constructor(){
        this.dto= new HiringRateDto()
    }

    public static Builder(): HiringRateDtoBuilder{
        return new HiringRateDtoBuilder()
    }

    public of(entity: HiringRate): HiringRateDtoBuilder{
        this.dto.id= entity.id;
        this.dto.hourlyPricing= entity.hourlyPricing;
        this.dto.weeklyPricing= entity.weeklyPricing;
        this.dto.monthlyPricing= entity.monthlyPricing;
        this.dto.dailyPricing= entity.dailyPricing;

        return this;
    }

    public build(): HiringRateDto{
        return this.dto;
    }

}