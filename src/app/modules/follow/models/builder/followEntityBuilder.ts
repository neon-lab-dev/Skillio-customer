import { AsyncContextService } from "@neon-lab-dev/platform";
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

    public async of(req: CreateFollowRequest):Promise<FollowEntityBuilder>{
        this.entity= globalMapper.map(req, CreateFollowRequest , Follow);
        this.entity.followerId= this.setFollowerId() as string;
        await followService.checkExisting(this.entity.followerId as string, req.followingId);
        return this;
    }

    private setFollowerId():string| undefined{
        const followerId= AsyncContextService.getUserId();
        return followerId;
    }

    public build():Follow{
        return this.entity;
    }

    
}