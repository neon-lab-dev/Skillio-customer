import {
  Entity,
  Column,
  OneToOne,
  OneToMany , Index
} from "typeorm";
import { BaseEntity } from "./baseEntity";
import { profileStatus, ProfileType } from "../modules/registration/enums/registrationEnum";
import { Contact } from "./contact";
import { Address } from "./address";
import { Portfolio } from "./portfolio";


@Entity("profile")
@Index("IDX_NICKNAME_PIN" , ["nickName" , "pin"])
export class Profile extends BaseEntity{

    @Column({nullable:true})
    firstName?: string;

    @Column({nullable:true})
    lastName?: string;

    @Column({nullable:true})
    groupName?:string;

    @Column()
    pin!:string;
    
    @Column({unique:true})
    nickName!: string;

    @Column({type: "enum", enum: profileStatus, default: profileStatus.REQUESTED})
    status!: profileStatus

    @Column({type: "enum", enum: ProfileType, default: ProfileType.INDIVIDUAL})
    profileType!: ProfileType;

    @OneToMany(() => Contact, contact => contact.profile , {
      cascade: true,           
    })
    contacts!: Contact[];

    @OneToOne(() => Address , address => address.profile , {
      cascade: true,
    })
    address!: Address;

    @OneToOne(()=>Portfolio , portfolio=> portfolio.profile , {
      cascade: true,
    })
    portfolio!: Portfolio;
}
