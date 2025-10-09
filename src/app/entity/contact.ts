import { Entity , Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Profile } from "./profile";
import { contactType } from "../modules/registration/enums/registrationEnum";

@Entity("contact")
@Index("IDX_PROFILEID_TYPE" , ["profileId" , "type"])
@Index("IDX_PROFILEID" , ["profileId"])
export class Contact extends BaseEntity{

    @Column({type:"enum", enum: contactType})
    type!: contactType;

    @Column({default:true})
    primary!: boolean;

    @Column({unique:true})
    value!: string;

    @Column({default:false})
    isVerified!: boolean;

    @Column({type:"uuid"})
    profileId!: string;

    @ManyToOne(() => Profile, profile => profile.contacts)
    @JoinColumn({name: "profileId"})
    profile!: Profile;

}