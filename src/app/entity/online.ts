import { Entity , Column ,PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile";
import { onlineStatus } from "../modules/registration/enums/registrationEnum";


@Entity("online")
export class Online{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type:"enum" , enum: onlineStatus, default: onlineStatus.OFFLINE})
    status!: onlineStatus;

    @Column({type:"timestamp" , nullable:true})
    lastSeen!:Date

    @Column({type: "uuid" , unique: true})
    profileId!: string;

    @OneToOne(()=>Profile , profile=>profile.online , {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"profileId"})
    profile!: Profile;

}