import { AppValidationError, ERROR_CODES } from "@neon-lab-dev/platform";
import { Follow } from "../../../../entity/followEntity";
import { globalMapper } from "../../../../mapper.global";
import { CreateFollowRequest } from "../request/createFollowRequest";
import followService from "../../followService";

export class FollowEntityBuilder{
    private entity: Follow;

    private constructor(){
        this.entity= new Follow();
    }

    public static builder():FollowEntityBuilder{
        return new FollowEntityBuilder()
    }

    public async of(req: CreateFollowRequest , followerId:string):Promise<FollowEntityBuilder>{
        this.entity= globalMapper.map(req, CreateFollowRequest , Follow);
        this.entity.followerId= followerId;
        return this;
    }

    public build():Follow{
        return this.entity;
    }

}