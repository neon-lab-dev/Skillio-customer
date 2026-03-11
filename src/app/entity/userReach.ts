import { AutoMap } from "@automapper/classes";
import { PersistEntity } from "./PersistEntity";
import { Entity , Column, OneToOne, JoinColumn, Index } from "typeorm";
import { Profile } from "./profile";

@Entity("user_reach")
export class UserReach extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type: "int",
        nullable:false,
        default:0
    })
    @AutoMap()
    followerCount!:number;

    @Column({
        type: "int",
        nullable:false,
        default:0
    })
    @AutoMap()
    followingCount!:number;

    @Column({
        type:"uuid",
        unique: true,
        nullable:false
    })
    @AutoMap()
    profileId!: string;

    @OneToOne(()=> Profile , profile=> profile.userReach,{
        onDelete: "CASCADE"
    })
    @JoinColumn({name:"profileid"})
    profile!: Profile

    protected getPrefix(): string {
        return "ur"
    }
}

