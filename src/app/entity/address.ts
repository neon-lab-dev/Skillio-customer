import { Entity , Column , JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Profile } from "./profile";
import { Location } from "../modules/registration/interface/registration.interface";
import { addressType } from "../modules/registration/enums/registrationEnum";

@Entity("address")
export class Address extends BaseEntity{
    @Column()
    streetAddress!: string;

    @Column({
        type:"enum",
        enum: addressType,
        nullable:false
    })
    type!: addressType

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

    @ManyToOne(()=>Profile ,profile=>profile.address , {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"profileId"})
    profile!: Profile;

}