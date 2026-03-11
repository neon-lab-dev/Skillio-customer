import { Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { UserReach } from "../../entity/userReach";
import { UserReachRepository } from "./repository/userReach.repository";
import { UserReachEntityBuilder } from "./models/builder/userReachEntityBuilder";

class UserReachService{
    private repository: UserReachRepository= new UserReachRepository();


    @Loggable()
    public async create(profileId:string){
        const entity= UserReachEntityBuilder.builder().of(profileId).build();
        return await this.repository.create(entity);
    }

    @Loggable()
    public async incrementFollowerCount(profileId: string){
        return await this.repository.increamentFollowerCount(profileId);
    }

    @Loggable()
    public async incrementFollowingCount(profileId:string){
        return await this.repository.incrementFollowingCount(profileId);
    }

    @Loggable()
    public async decrementFollowerCount(profileId: string){
        return await this.repository.decrementFollowerCount(profileId);
    }

    @Loggable()
    public async decrementFollowingCount(profileId: string){
        return await this.repository.decrementFollowingCount(profileId);
    }

    public async fetch(profileId:string):Promise<UserReach | null>{
        return await this.repository.fetch(profileId);
    }
}

export default new UserReachService();