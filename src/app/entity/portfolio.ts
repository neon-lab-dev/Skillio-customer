import { Entity , Column, OneToOne, JoinColumn, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { proficiecy } from "../modules/registration/enums/registrationEnum";
import { Profile } from "./profile";
import { Document } from "./documentEntity";
import { UserSubscriptionEntity } from "../modules/entity/UserSubscriptionEntity";
import { Sensitive } from "@neon-lab-dev/platform";
import { HiringRate } from "./hiringRate";
import { Follows } from "./follows";
import { PlanAggregator } from "../modules/entity/planAggregator";

@Entity("portfolio")
@Index("IDX_CATEGORY_SUBCATEGORY" , ["category" , "subCategory"])
@Index("IDX_CATEGORY_SUBCATEGORY_PROFICIENCY" , ["category" ,"subCategory", "proficiency"])
export class Portfolio extends BaseEntity{
    @Column()
    category!: string;

    @Column()
    subCategory!: string;

    @Column({type:"enum", enum: proficiecy})
    proficiency!: proficiecy;

    @Column({nullable:true , default:0})
    totalEvents?: number;

    @Column({nullable:true})
    bio?: string;

    @OneToMany(()=>Document , document=> document.portfolio , {
        cascade:true,
    })
    document!: Document;

    @Column({type:"uuid"})
    profileId!: string;

    @OneToOne(()=>Profile , profile=>profile.portfolio , {
        onDelete: "CASCADE"
    })
    @JoinColumn({name:"profileId"})
    profile!: Profile;

    @OneToMany(
        () => UserSubscriptionEntity,
        u => u.portfolio
    )
    @Sensitive()
    subscriptions!: Promise<UserSubscriptionEntity[]>

    @OneToOne(()=>HiringRate , hiringRate=> hiringRate.portfolio , {
        cascade: true,
        lazy: true
    })
    hiringRate!: HiringRate

    @OneToOne(()=>Follows , follows=>follows.portfolio, {
        cascade:true,
    })
    follows?: Follows

    @OneToOne(()=> PlanAggregator , planAggregator=> planAggregator.portfolio,{
        cascade:true,
        lazy:true
    })
    planAggregator?: PlanAggregator
    
}