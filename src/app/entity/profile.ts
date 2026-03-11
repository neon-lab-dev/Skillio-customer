import {
  Entity,
  Column,
  OneToOne,
  OneToMany , Index
} from "typeorm";
import { BaseEntity } from "./baseEntity";
import { profileStatus, ProfileType, roles } from "../modules/registration/enums/registrationEnum";
import { Contact } from "./contact";
import { Address } from "./address";
import { Portfolio } from "./portfolio";
import { Online } from "./online";
import { Privacy } from "./privacy";
import { UserReach } from "./userReach";


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

    @Column({type: "enum", enum: profileStatus, default: profileStatus.PENDING})
    status!: profileStatus

    @Column({type: "enum", enum: ProfileType, default: ProfileType.INDIVIDUAL})
    profileType!: ProfileType;

    @Column({type:"boolean",default:false})
    isSubscribed!: boolean;

    @Column({type: "enum" ,enum: roles, default: roles.USER , nullable: false })
    role! : roles

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

    @OneToOne(()=>Online, online=>online.profile,{
      cascade:true,
    })
    online?: Online;

    @OneToOne(()=>Privacy , privacy=> privacy.profile, {
      cascade: true
    })
    privacy!: Privacy

    @OneToOne(()=> UserReach , userReach=>userReach.profile, {
      cascade: true
    })
    userReach!: UserReach
}
