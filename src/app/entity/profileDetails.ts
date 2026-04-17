import { profileStatus, ProfileType } from "../modules/registration/enums/registrationEnum";
import { PersistEntity } from "./PersistEntity";
import { Entity , Column, OneToOne, JoinColumn  } from "typeorm";
import { Profile } from "./profile";

@Entity("profile_details")
export class ProfileDetails extends PersistEntity{
    constructor(){
        super()
    }

    @Column({nullable:true})
    firstName?: string;

    @Column({nullable:true})
    lastName?: string;

    @Column({nullable:true})
    groupName?:string;

    @Column({unique:true})
    nickName!: string;

    
    @Column({type: "enum", enum: profileStatus, default: profileStatus.PENDING})
    status!: profileStatus


    @Column({type: "enum", enum: ProfileType, default: ProfileType.INDIVIDUAL})
    profileType!: ProfileType;

    @Column({type:"varchar" , unique: true})
    profileId!:string;

    @OneToOne(()=>Profile , profile=> profile.profileDetails, {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"profileId"})
    profile!:Profile

    protected getPrefix(): string {
        return "pd"
    }
}