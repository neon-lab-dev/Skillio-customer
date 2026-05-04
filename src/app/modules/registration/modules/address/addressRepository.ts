import { BaseRepository } from "@neon-lab-dev/platform";
import { Address } from "../../../../entity/address";
import { AppDataSource } from "../../../../db/dataSource";
import { DeepPartial } from "typeorm";

export class AddressRepository extends BaseRepository<Address>{
    constructor(){
        super(AppDataSource , Address)
    }

    async updateByProfileId(profileId:string , addressData: DeepPartial<Address>){
        return await this.repository.update({profileId} , addressData);
    }
}