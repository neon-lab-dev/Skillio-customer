import { AppDataSource } from "../db/dataSource";
import { Call } from "../entity/call";
import { DeepPartial, Repository } from "typeorm";

class CallRepository{
    private callRepository: Repository<Call>;

    constructor(){
        this.callRepository= AppDataSource.getRepository<Call>("Call")
    }


    // create a call
    createCall= async(callData: DeepPartial<Call>)=>{
        const newCall= this.callRepository.create(callData);
        return await this.callRepository.save(newCall)
    }

    // update a call
    updateCall= async(id:string , callData: DeepPartial<Call>)=>{
        return await this.callRepository.update(
            id,
            callData
        )
    }
    
    // find by id
    findById= async(id:string)=>{
        return await this.callRepository.findOneBy({
            id
        })
    }


}

export default new CallRepository();