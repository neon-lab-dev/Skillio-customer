import { BaseRepository } from "@neon-lab-dev/platform";
import { AppDataSource } from "../db/dataSource";
import { FcmToken } from "../entity/fcmToken";

export class TokenRepository extends BaseRepository<FcmToken>{
    constructor(){
        super(AppDataSource , FcmToken)
    }

    async findByUserId(userId:string){
        return await this.repository.findOneBy({
            userId
        })
    }

    async upsert(userId: string , token:string){
        await this.repository.save(
            {
                userId,
                token
            }
        )
    }
}