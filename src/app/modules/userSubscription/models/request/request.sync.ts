import { AppRequest } from "@neon-lab-dev/platform";

export class SyncSubscriptionStatusRequest implements AppRequest{

    id!: string;
    hard!: boolean;

}