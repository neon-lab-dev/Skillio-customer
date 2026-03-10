import { BaseRepository } from "@neon-lab-dev/platform";
import { Privacy } from "../../entity/privacy";
import { AppDataSource } from "../../db/dataSource";
import { DeepPartial } from "typeorm";

export class PrivacyRepository extends BaseRepository<Privacy>{
    constructor(){
        super(AppDataSource, Privacy)
    }

    async update(id: string , updatedData: DeepPartial<Privacy>){
        await this.repository.update(id , updatedData);
    }

    async findByProfileId(profileId:string):Promise<Privacy | null>{
        return await this.repository.findOneBy({
            profileId
        })
    }
}