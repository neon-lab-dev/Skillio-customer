import { BaseRepository } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../../entity/planAggregator";
import { AppDataSource } from "../../../db/dataSource";
import { DeepPartial } from "typeorm";

export class PlanAggregatorRepository extends BaseRepository<PlanAggregator>{
    constructor(){
        super(AppDataSource, PlanAggregator)
    }

    async upsert(updated: DeepPartial<PlanAggregator> , portfolioId: string){
        return await this.repository.upsert({
            portfolioId,
            ...updated
        }, ['portfolioId']);
    }

    async findByPortfolioId(portfolioId:string):Promise<PlanAggregator | null>{
        return await this.repository.findOneBy({portfolioId})
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