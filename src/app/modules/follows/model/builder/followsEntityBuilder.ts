import { AsyncContextService } from "@neon-lab-dev/platform";
import { Follows } from "../../../../entity/follows";
import { CreateFollowsRequest } from "../request/createFollowsRequest";
import { profileService } from "../../../profile/service.profile";
import followService from "../../followService";

export class FollowsEntityBuilder{
    private entity: Follows;

    private constructor(){
        this.entity= new Follows;
    }

    public static Builder(): FollowsEntityBuilder{
        return new FollowsEntityBuilder();
    }

    public async of(req: CreateFollowsRequest): Promise<FollowsEntityBuilder>{
        this.entity.socialMedia= req.socialMedia;
        this.entity.link= req.link;
        this.entity.followers= req.followers;
        this.entity.following= req.following;

        await this.setPortfolioid();
        await this.checkExistingFollows();

        return this;
    }

    public build(): Follows{
        return this.entity;
    }

    private async setPortfolioid(){
        const profileId= AsyncContextService.getUserId() as string;
        const profile= await profileService.fetchWithPortfolio(profileId);
        this.entity.portfolioId= profile.portfolio?.id as string;
    }

    private async checkExistingFollows(){
        await followService.checkExistingFollows(this.entity.socialMedia , this.entity.portfolioId);
    }

    public async ofArray(followsRequest: CreateFollowsRequest[]):Promise<Follows[]>{
        return await Promise.all(followsRequest.map(async val=> (await FollowsEntityBuilder.Builder().of(val)).build()));
    }
}