import { AppRequest } from "@neon-lab-dev/platform";
import Decimal from "decimal.js";


export class UpdateHiringRateRequest implements AppRequest{
    id!: string;
    hourlyPricing!: Decimal;
    dailyPricing!: Decimal;
    weeklyPricing!: Decimal;
    monthlyPricing!: Decimal;
}