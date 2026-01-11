import { AppRequest } from "@neon-lab-dev/platform";

export class UpdateActivePlanMaster implements AppRequest {

    ids!: Set<string>;
    active!: boolean;

}