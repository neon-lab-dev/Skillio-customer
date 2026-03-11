import { BaseRepository } from "@neon-lab-dev/platform";
import { UserReach } from "../../../entity/userReach";
import { AppDataSource } from "../../../db/dataSource";

export class UserReachRepository extends BaseRepository<UserReach>{
    constructor(){
        super(AppDataSource, UserReach);
    }

    async increamentFollowerCount(profileId: string){
        await this.repository.increment({profileId} , "followerCount" ,1);
    }


    async decrementFollowerCount(profileId: string){
        await this.repository.decrement({profileId} , "followerCount" , 1);
    }

    async incrementFollowingCount(profileId: string){
        await this.repository.increment({profileId} , "followingCount" ,1);
    }


    async decrementFollowingCount(profileId: string){
        await this.repository.decrement({profileId} , "followingCount" , 1);
    }

    async fetch(profileId: string):Promise<UserReach | null>{
        return await this.repository.findOneBy({profileId})
    }
}