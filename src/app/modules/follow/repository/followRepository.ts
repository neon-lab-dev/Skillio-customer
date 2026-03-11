import { BaseRepository } from "@neon-lab-dev/platform";
import { AppDataSource } from "../../../db/dataSource";
import { Follow } from "../../../entity/followEntity";

export class FollowRepository extends BaseRepository<Follow>{
    constructor(){
        super(AppDataSource, Follow)
    }

    

    async findByFollowerAndFollowingId(followerId: string , followingId: string ): Promise<Follow | null>{
        return await this.repository.findOneBy({
            followerId: followerId,
            followingId: followingId
        })
    }

    async fetchFollowers(profileId: string , page?: string , perPage?:string){
        const followersPage = page? parseInt(page): 1;
        const limit= perPage? parseInt(perPage): 10;
        const skip= (followersPage-1)*limit;

        const res= await this.repository.find({
            where:{
                followingId: profileId
            },
            take: limit,
            skip: skip,
            order: {createdAt: "DESC"}
        })

        return res

    }

    async fetchFollowing(profileId: string , page?:string , perPage?:string){
        const followingPage = page? parseInt(page): 1;
        const limit= perPage? parseInt(perPage): 10;
        const skip= (followingPage-1)*limit;

        const res= await this.repository.find({
            where:{
                followerId: profileId
            },
            take: limit,
            skip: skip,
            order: {createdAt:"DESC"}
        })

        return res;
    }

    async unFollow(followerId: string , followingId: string){
        return await this.repository.delete({
            followerId,
            followingId
        })
    }


    
}