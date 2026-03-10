import { AppValidationError, AsyncContextService, ERROR_CODES } from "@neon-lab-dev/platform";
import { FollowEntityBuilder } from "./models/builder/followEntityBuilder";
import { FollowResponseDtoBuilder } from "./models/builder/followResponseDtoBuilder";
import { CreateFollowRequest } from "./models/request/createFollowRequest";
import { FollowResponseDto } from "./models/response/followResponseDto";
import { FollowRepository } from "./repository/followRepository";
import registrationServices from "../registration/registration.services";
import { FetchFollowingRequest } from "./models/request/fetchFollowingRequest";
import { FetchFollowerRequest } from "./models/request/fetchFollowerRequest";
import { FetchCountRequest } from "./models/request/fetchCountRequest";

class FollowService{
    private repository: FollowRepository= new FollowRepository();

    public async checkExisting(followerId: string , followingId: string){
        const existing= await this.repository.findByFollowerAndFollowingId(followerId , followingId);
        return existing;
    }

    public async create(req: CreateFollowRequest):Promise<FollowResponseDto>{
        const existing= await registrationServices.checkExisting(req.followingId);
        if(existing){
            throw new AppValidationError("Profile already followed" , ERROR_CODES.DUPLICATE_ENTRY);
        }
        const entity= (await FollowEntityBuilder.builder().of(req)).build();
        const res= await this.repository.create(entity);
        return FollowResponseDtoBuilder.builder().of(res).build();
    }

    public async fetchFollowers(req: FetchFollowerRequest){
        const profileId= AsyncContextService.getUserId();
        const res= await this.repository.fetchFollowers(profileId as string , req.page , req.perPage);
        const followers= FollowResponseDtoBuilder.builder().ofArray(res.data);
        return{
            followers: followers,
            totalCount: res.count
        }
    }

    public async fetchFollowing(req: FetchFollowingRequest){
        const proifleId= AsyncContextService.getUserId();
        const res= await this.repository.fetchFollowing(proifleId as string , req.page , req.perPage);
        const following= FollowResponseDtoBuilder.builder().ofArray(res.data);
        return{
            following: following,
            totalCount: res.count
        }
    }

    public async fetchCount(req: FetchCountRequest){
        const profileId= AsyncContextService.getUserId();
        return await this.repository.fetchCount(profileId as string);
    }
}

export default new FollowService();