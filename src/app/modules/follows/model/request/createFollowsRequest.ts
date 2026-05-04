import { AppRequest } from "@neon-lab-dev/platform";
import { SocialMeida } from "../../../registration/enums/registrationEnum";

export class CreateFollowsRequest implements AppRequest{
    socialMedia!:SocialMeida;
    link!: string;
    followers!: number;
    following!: number;
}