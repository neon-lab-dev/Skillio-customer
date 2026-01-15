import { Column, Entity, Index } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { PlanType } from "../planMaster/enum/PlanType";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { PlanMasterStatus } from "../planMaster/enum/PlanMasterStatus";

@Entity(
    {
        name: "plan_masters"
    }
)
@Index("IDX_PRIORITY", ["priority"])
export class PlanMasterEntity extends PersistEntity {

    constructor() {
        super();
    }

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    callLimits!: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    chatLimits!: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    validity!: number;

    @Column({
        type: "boolean",
        nullable: true,
        default: true
    })
    active!: boolean;

    @Column({
        type: "text",
        nullable: true,
        default: true
    })
    description!: string;

    @Column(
        {
            type:"simple-enum",
            enum: ProfileVisibility,
            nullable: false,
            default: ProfileVisibility.ZERO
        }
    )
    profileVisibility!: ProfileVisibility;

    @Column(
        {
            type: "int",
            nullable: false,
            default: -1
        }
    )
    priority!: number;

    @Column(
        {
            type: "varchar",
            nullable: false
        }
    )
    code!: string;

    @Column(
        {
            type:"int",
            nullable: false,
            default: 0
        }
    )
    version!: number;

    @Column(
        {
            type:"int",
            nullable: false
        }
    )
    priceInPaise!:number; // Rs 1 = 100 paise

    @Column(
        {
            type: "simple-enum",
            enum: PlanType,
            nullable: false
        }
    )
    type!: PlanType;

    @Column(
        {
            type: "simple-enum",
            enum: PlanMasterStatus,
            nullable: false
        }
    )
    status!: PlanMasterStatus;



    protected getPrefix(): string {
        return "pm";
    }

}