import { AppRequest, BaseDeleteDto } from "@neon-lab-dev/platform";


export class DeletePlanMasterDto extends BaseDeleteDto implements AppRequest {

    ids!: Set<string>;

}   