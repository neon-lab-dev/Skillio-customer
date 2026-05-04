import { Loggable } from "@neon-lab-dev/platform";
import { AddressRepository } from "./addressRepository";
import { CreateAddressRequest } from "./request/createAddressRequest";
import { AddressEntityBuilder } from "./builder/addressEntityBuilder";
import { DeepPartial } from "typeorm";
import { Address } from "../../../../entity/address";

class AddressService{
    private repository= new AddressRepository();

    @Loggable()
    public async create(req: CreateAddressRequest , profileId:string){
        const entity= AddressEntityBuilder.builder().of(req , profileId).build();
        return this.repository.create(entity);
    }

    @Loggable()
    public async updateByProfileId(profileId:string , updatedData: DeepPartial<Address>){
        return await this.repository.updateByProfileId(profileId , updatedData);
    }

}

export default new AddressService();