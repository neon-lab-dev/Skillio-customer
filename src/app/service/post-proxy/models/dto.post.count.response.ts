import { AppResponseData } from "@neon-lab-dev/platform";
import { Expose } from "class-transformer";

export class PostcountResponseDto implements AppResponseData{
    @Expose()
    count!: number;
}