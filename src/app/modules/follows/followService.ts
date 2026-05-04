import { AppValidationError, ERROR_CODES, Loggable } from "@neon-lab-dev/platform";
import { FollowRepository } from "./followRepository";
import { CreateFollowsRequest } from "./model/request/createFollowsRequest";
import { FollowsEntityBuilder } from "./model/builder/followsEntityBuilder";
import { SocialMeida } from "../registration/enums/registrationEnum";

class FollowsService{
    private repository= new FollowRepository();

    @Loggable()
    public async checkExistingFollows(socialMedia:SocialMeida , portfolioId:string){
        const existingFollows= await this.repository.findFollowsBySocialMediaAndPortfolioId(socialMedia , portfolioId);
        if(existingFollows){
            throw new AppValidationError("Social Media already exists" , ERROR_CODES.CONFLICT);
        }
    }

    @Loggable()
    public async create(req: CreateFollowsRequest){
        const entity= (await FollowsEntityBuilder.Builder().of(req)).build();

        return await this.repository.create(entity);
    }
}

export default new FollowsService();