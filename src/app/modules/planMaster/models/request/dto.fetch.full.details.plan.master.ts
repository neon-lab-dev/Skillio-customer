import { AppRequest } from "@neon-lab-dev/platform";

export class fetchByIdRequestDto implements AppRequest{
    id!: string;
}