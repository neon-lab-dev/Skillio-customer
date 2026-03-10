import {  AppRequest } from "@neon-lab-dev/platform";

export class FetchFollowerRequest implements AppRequest{

    page?:string;

    perPage?:string;

}