import { BaseRepository } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../../entity/planAggregator";
import { AppDataSource } from "../../../db/dataSource";
import { DeepPartial } from "typeorm";

export class PlanAggregatorRepository extends BaseRepository<PlanAggregator>{
    constructor(){
        super(AppDataSource, PlanAggregator)
    }

    async update(updated: DeepPartial<PlanAggregator> , portfolioId: string){
        return await this.repository.update({portfolioId} , updated);
    }

    async findByPortfolioId(portfolioId:string):Promise<PlanAggregator | null>{
            console.log('Is valid UUID?:',portfolioId); 
        return await this.repository.findOne({
            where:{
                portfolioId: portfolioId
            }
        })
    }

    async reduceCallLimits(portfolioId: string, existingVersion: number , amount?: number){
        const reducedAmount= amount? amount :1;
        await this.repository.update(
            {portfolioId , version: existingVersion},
            {version: existingVersion+1}
        )
        return await this.repository.decrement(
            {portfolioId} , 
            "callLimits",
            reducedAmount
        )
    }   

    async reduceChatLimits(portfolioId: string ,existingVersion: number, amount?:number){
        const reducedAmount= amount? amount :1;
        await this.repository.update(
            {portfolioId , version:existingVersion },
            {version: existingVersion+1}
        )
        return await this.repository.decrement(
            {portfolioId},
            "chatLimits",
            reducedAmount
        )
    }
}