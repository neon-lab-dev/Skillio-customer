import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository } from "typeorm";
import { Online } from "../entity/online";

class OnlineRepository{
    private onlineRepository: Repository<Online>;

    constructor(){
        this.onlineRepository=AppDataSource.getRepository<Online>("Online");
    }

    upsertOnlineStatus= async(profileId: string , onlineData: DeepPartial<Online>)=>{
        return await this.onlineRepository.upsert({
            profileId,
            ...onlineData
        },
        ["profileId"])
    }

    updateByProfileId= async(profileId: string , onlineData: DeepPartial<Online>)=>{
        return await this.onlineRepository.update({
            profileId
        },
        onlineData)
    }
}

export default new OnlineRepository();