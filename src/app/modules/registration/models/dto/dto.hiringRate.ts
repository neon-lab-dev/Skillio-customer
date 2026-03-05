import { AppResponseData } from "@neon-lab-dev/platform";
import Decimal from "decimal.js";

export class HiringRateDto implements AppResponseData{
    id!:string;
    hourlyPricing!: Decimal;
    dailyPricing!: Decimal;
    weeklyPricing!: Decimal;
    monthlyPricing!: Decimal;
}