import { PersistEntity } from "../../entity/PersistEntity";
import { Entity , Column, OneToOne, JoinColumn } from "typeorm";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { AutoMap } from "@automapper/classes";
import { Portfolio } from "../../entity/portfolio";

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
    acitvePlans!: number

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
    portfolioId!:string

    @OneToOne(()=>Portfolio , Portfolio=> Portfolio.planAggregator,{
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "portfolioId"})
    portfolio!: Portfolio

    protected getPrefix(): string {
        return "pa"
    }

}