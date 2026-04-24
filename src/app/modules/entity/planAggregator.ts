import { PersistEntity } from "../../entity/PersistEntity";
import { Entity , Column, OneToOne, JoinColumn } from "typeorm";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { AutoMap } from "@automapper/classes";
import { Profile } from "../../entity/profile";

@Entity("plan_aggregator")
export class PlanAggregator extends PersistEntity{
    constructor(){
        super();
    }

    @Column({
        type:"int",
        nullable:false,
        default:0
    })
    @AutoMap()
    callLimits!: number;

    @Column({
        type:"int",
        nullable:false , 
        default:0
    })
    @AutoMap()
    chatLimits!: number;

    @Column({
        type: "simple-enum",
        enum: ProfileVisibility,
        nullable:false,
        default:ProfileVisibility.ZERO
    })
    @AutoMap()
    profileVisibility!: ProfileVisibility;

    @Column("text",{
        array:true,
        nullable:false
    })
    @AutoMap()
    userSubscriptionIds!: string[]

    @Column({
        type:"int",
        nullable: false,
        default: 0
    })
    @AutoMap()
    activePlans!: number

    @Column({
        type:"int",
        nullable:false,
        default:0
    })
    @AutoMap()
    version!: number

    @Column({
        type:"uuid",
        nullable:false,
        unique:true
    })
    profileId!:string

    @OneToOne(()=>Profile , proflie=> proflie.planAggregator,{
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "profileId"})
    profile!: Profile

    protected getPrefix(): string {
        return "pa"
    }

}