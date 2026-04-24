import { BaseRepository } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../../entity/planAggregator";
import { AppDataSource } from "../../../db/dataSource";
import { DeepPartial } from "typeorm";

export class PlanAggregatorRepository extends BaseRepository<PlanAggregator>{
    constructor(){
        super(AppDataSource, PlanAggregator)
    }

    async update(updated: DeepPartial<PlanAggregator> , profileId: string){
        return await this.repository.update({profileId} , updated);
    }

    async findByProfileId(profileId:string):Promise<PlanAggregator | null>{
        return await this.repository.findOne({
            where:{
                profileId
            }
        })
    }

    async reduceCallLimits(profileId: string, existingVersion: number , amount?: number){
        const reducedAmount= amount? amount :1;
        await this.repository.update(
            {profileId , version: existingVersion},
            {version: existingVersion+1}
        )
        return await this.repository.decrement(
            {profileId} , 
            "callLimits",
            reducedAmount
        )
    }   

    async reduceChatLimits(profileId: string ,existingVersion: number, amount?:number){
        const reducedAmount= amount? amount :1;
        await this.repository.update(
            {profileId , version:existingVersion },
            {version: existingVersion+1}
        )
        return await this.repository.decrement(
            {profileId},
            "chatLimits",
            reducedAmount
        )
    }
}