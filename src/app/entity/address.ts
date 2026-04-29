import { Entity , Column ,OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Profile } from "./profile";
import { Location } from "../modules/registration/interface/registration.interface";

@Entity("address")
export class Address extends BaseEntity{
    @Column()
    streetAddress!: string;

    @Column()
    city!: string;
    
    @Column()
    country!: string;

    @Column()
    state!: string;

    @Column()
    pinCode!: number;

    @Column({type:"json"})
    location!: Location;

    @Column({type:"uuid"})
    profileId!: string;

    @OneToOne(()=>Profile ,profile=>profile.address , {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"profileId"})
    profile!: Profile;

}