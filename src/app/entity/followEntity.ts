import { AutoMap } from "@automapper/classes";
import { PersistEntity } from "./PersistEntity";
import { Entity , Column, Index } from "typeorm";

@Entity("follow")
@Index("IDX_FOLLOWERID" , ["followerId"])
@Index("IDX_FOLLOWINGID" , ["followingId"])
export class Follow extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type:"text",
        nullable: false
    })
    @AutoMap()
    followerId!: String

    @Column({
        type:"text",
        nullable:false
    })
    @AutoMap()
    followingId!: String

    protected getPrefix(): string {
        return "fol"
    }
}