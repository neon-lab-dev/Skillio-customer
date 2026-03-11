import { AppValidationError, AsyncContextService, ERROR_CODES, Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { FollowEntityBuilder } from "./models/builder/followEntityBuilder";
import { FollowResponseDtoBuilder } from "./models/builder/followResponseDtoBuilder";
import { CreateFollowRequest } from "./models/request/createFollowRequest";
import { FollowResponseDto } from "./models/response/followResponseDto";
import { FollowRepository } from "./repository/followRepository";
import registrationServices from "../registration/registration.services";
import { FetchFollowingRequest } from "./models/request/fetchFollowingRequest";
import { FetchFollowerRequest } from "./models/request/fetchFollowerRequest";
import { FetchCountRequest } from "./models/request/fetchCountRequest";
import userReachService from "../userReach/userReach.service";
import { UserReachResponseDtoBuilder } from "../userReach/models/builder/userReachResponeDtoBuilder";
import { UnfollowRequest } from "./models/request/unfollowRequest";

class FollowService{
    private repository: FollowRepository= new FollowRepository();

    @Loggable()
    private async incrementFollower(profileId:string){
        const existing=await userReachService.fetch(profileId);
        if(!existing){
           await userReachService.create(profileId);
        }
        await userReachService.incrementFollowerCount(profileId);
    }

    @Loggable()
    private async incrementFollowing(profileId:string){
        const existing=await userReachService.fetch(profileId);
        if(!existing){
           await userReachService.create(profileId);
        }
        await userReachService.incrementFollowingCount(profileId);
    }

    @Loggable()
    public async checkExisting(followerId: string , followingId: string){
        const existing= await this.repository.findByFollowerAndFollowingId(followerId , followingId);
        return existing;
    }

    @Loggable()
    public async create(req: CreateFollowRequest):Promise<FollowResponseDto>{
        await registrationServices.checkExisting(req.followingId);
        const followerId= AsyncContextService.getUserId() as string;
        const existing= await this.checkExisting(followerId , req.followingId);
        if(existing){
            throw new AppValidationError("profile already followed" , ERROR_CODES.CONFLICT);
        }
        const entity= (await FollowEntityBuilder.builder().of(req , followerId)).build();
        const res= await this.repository.create(entity);
        await this.incrementFollower(req.followingId);
        await this.incrementFollowing(followerId);
        return FollowResponseDtoBuilder.builder().of(res).build();
    }

    @Loggable()
    public async fetchFollowers(req: FetchFollowerRequest){
        const profileId= AsyncContextService.getUserId() as string;
        const res= await this.repository.fetchFollowers(profileId , req.page , req.perPage);
        const followers= await Promise.all(res.map(async(val)=> registrationServices.getShortProfile(val.followerId as string)));
        const count= await userReachService.fetch(profileId);
        return{
            followers: followers,
            totalCount: count?.followerCount
        }
    }

    @Loggable()
    public async fetchFollowing(req: FetchFollowingRequest){
        const proifleId= AsyncContextService.getUserId() as string;
        const res= await this.repository.fetchFollowing(proifleId,req.page , req.perPage);
        const following= await Promise.all(res.map(async(val)=> registrationServices.getShortProfile(val.followingId as string)));
        const count= await userReachService.fetch(proifleId);

        return{
            following: following,
            totalCount: count?.followingCount
        }
    }

    @Loggable()
    public async fetchCount(req: FetchCountRequest){
        const profileId= AsyncContextService.getUserId();
        const res= await userReachService.fetch(profileId as string);
        if(!res){
            throw new NotFoundError("userReach doesnot exist");
        }
        return UserReachResponseDtoBuilder.builder().of(res).build()
    }

    @Loggable()
    public async unfollow(req: UnfollowRequest){
        const followerId= AsyncContextService.getUserId() as string;
        const existing= await this.checkExisting(followerId, req.followingId);
        if(!existing){
            throw new NotFoundError("you do not follow this profile")
        }
        await this.repository.unFollow(followerId , req.followingId);
        await userReachService.decrementFollowerCount(req.followingId);
        await userReachService.decrementFollowingCount(followerId);
    }
}

export default new FollowService();