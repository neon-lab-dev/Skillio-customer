import { AutoMap } from "@automapper/classes";
import { AppRequest } from "@neon-lab-dev/platform";

export class TokenRequest implements AppRequest{
    @AutoMap()
    userId!:string;

    @AutoMap()
    token!:string;
}