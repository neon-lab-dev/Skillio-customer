import { Entity , Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Profile } from "./profile";
import { contactType } from "../modules/registration/enums/registrationEnum";

@Entity("contact")
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