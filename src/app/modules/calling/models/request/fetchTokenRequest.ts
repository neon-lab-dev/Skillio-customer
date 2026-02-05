import { AppRequest } from "@neon-lab-dev/platform";
import { callProvider } from "../../enums/callProvider";

export class FetchTokenRequest implements AppRequest{
    provider!: callProvider;
    callerId!: string;
}