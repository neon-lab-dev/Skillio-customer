import { BaseRepository } from "@neon-lab-dev/platform";
import { Follows } from "../../entity/follows";
import { AppDataSource } from "../../db/dataSource";
import { SocialMeida } from "../registration/enums/registrationEnum";

export class FollowRepository extends BaseRepository<Follows>{
    constructor(){
        super(AppDataSource , Follows)
    }

    async findFollowsBySocialMediaAndPortfolioId(socialMedia: SocialMeida , portfolioId:string):Promise<Follows | null>{
        return await this.repository.findOneBy({
            socialMedia,
            portfolioId
        })
    }
}