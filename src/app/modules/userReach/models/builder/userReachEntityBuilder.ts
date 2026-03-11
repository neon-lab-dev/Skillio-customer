import { UserReach } from "../../../../entity/userReach";

export class UserReachEntityBuilder {
    private entity: UserReach;

    private constructor(){
        this.entity= new UserReach()
    }

    public static builder(): UserReachEntityBuilder{
        return new UserReachEntityBuilder()
    }

    public of(profileId: string): UserReachEntityBuilder{
        this.entity.profileId=profileId;
        return this;
    }

    public build(): UserReach{
        return this.entity;
    }

}