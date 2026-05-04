import {
  Entity,
  Column,
  OneToOne,
  OneToMany
} from "typeorm";
import { BaseEntity } from "./baseEntity";
import { roles } from "../modules/registration/enums/registrationEnum";
import { Contact } from "./contact";
import { Address } from "./address";
import { Portfolio } from "./portfolio";
import { Online } from "./online";
import { ProfileDetails } from "./profileDetails";
import { Sensitive } from "@neon-lab-dev/platform";
import { UserSubscriptionEntity } from "../modules/entity/UserSubscriptionEntity";
import { PlanAggregator } from "../modules/entity/planAggregator";

@Entity("profile")
export class Profile extends BaseEntity{

    @Column({type:"boolean",default:false})
    isSubscribed!: boolean;

    @Column({
      type:"boolean",
      default:false
    })
    isOnboarded!:boolean

    @Column({
      type:"boolean",
      default:false
    })
    isCreator!:boolean

    @Column({
        nullable:true
    })
    pin?:string;
        
    @Column({type: "enum" ,enum: roles, default: roles.USER , nullable: false })
    role! : roles

    @OneToMany(() => Contact, contact => contact.profile , {
      cascade: true,           
    })
    contacts!: Contact[];

    @OneToOne(()=>ProfileDetails , profileDetails=>profileDetails.profile,{
      cascade:true
    })
    profileDetails?: ProfileDetails;

    @OneToMany(() => Address , address => address.profile , {
      cascade: true,
    })
    address?: Address[];

    @OneToOne(()=>Portfolio , portfolio=> portfolio.profile , {
      cascade: true,
    })
    portfolio?: Portfolio;

    @OneToOne(()=>Online, online=>online.profile,{
      cascade:true,
    })
    online?: Online;

    @OneToMany(
        () => UserSubscriptionEntity,
        u => u.profile
    )
    @Sensitive()
    subscriptions!: Promise<UserSubscriptionEntity[]>
    
    @OneToOne(()=> PlanAggregator , planAggregator=> planAggregator.profile,{
        cascade:true,
        lazy:true
    })
    planAggregator?: PlanAggregator
    
}
