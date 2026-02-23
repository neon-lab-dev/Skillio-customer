import { BaseRepository } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../../entity/planAggregator";
import { AppDataSource } from "../../../db/dataSource";
import { DeepPartial } from "typeorm";

export class PlanAggregatorRepository extends BaseRepository<PlanAggregator>{
    constructor(){
        super(AppDataSource, PlanAggregator)
    }

    async upsert(updated: DeepPartial<PlanAggregator> , portfolioId: string){
        return await PlanAggregator.upsert({
            portfolioId,
            ...updated
        }, ['portfolioId']);
    }

    async findByPortfolioId(portfolioId:string):Promise<PlanAggregator | null>{
        return await PlanAggregator.findOneBy({portfolioId})
    }
}