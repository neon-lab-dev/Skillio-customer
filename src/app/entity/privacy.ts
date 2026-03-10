import { AutoMap } from "@automapper/classes";
import { privacyType } from "../modules/privacy/enums/privacyEnum";
import { PersistEntity } from "./PersistEntity";
import { Entity , Column , OneToOne, JoinColumn, Index } from "typeorm";
import { Profile } from "./profile";

@Entity("privacy")
@Index("IDX_profileId" , ["profileId"])
export class Privacy extends PersistEntity{
    constructor(){
        super()
    }

    @Column( {
        type:"enum",
        enum: privacyType,
        default: privacyType.PUBLIC,
        nullable: false
    })
    @AutoMap()
    type!: privacyType

    @Column({
        type:"varchar",
        unique: true,
        nullable: false
    })
    @AutoMap()
    profileId!: string;

    @OneToOne(()=> Profile , profile=> profile.privacy,{
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "profileId"})
    profile!: Profile

    protected getPrefix(): string {
        return "pr"
    }
}