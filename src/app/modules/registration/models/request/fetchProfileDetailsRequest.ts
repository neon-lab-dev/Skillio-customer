import { AppRequest } from "@neon-lab-dev/platform";

export class FetchProfileDetailsRequest implements AppRequest{
    id!: string;
}