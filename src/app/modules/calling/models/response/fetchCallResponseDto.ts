import { AutoMap } from "@automapper/classes";
import {  AppResponseData } from "@neon-lab-dev/platform";

export class FetchCallResponseDto implements AppResponseData{
    @AutoMap()
    id!:string;

    @AutoMap()
    callerId!:string;

    @AutoMap()
    recipientId!:string;

    @AutoMap()
    startedAt!: Date;

    @AutoMap()
    endedAt!: Date;

    duration!: number;
}