import { Column, Entity, Index } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { PlanType } from "../planMaster/enum/PlanType";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { PlanMasterStatus } from "../planMaster/enum/PlanMasterStatus";
import { AutoMap } from "@automapper/classes";

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
    @AutoMap()
    callLimits!: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    @AutoMap()
    chatLimits!: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    @AutoMap()
    validity!: number;

    @Column({
        type: "boolean",
        nullable: true,
        default: true
    })
    @AutoMap()
    active!: boolean;

    @Column({
        type: "text",
        nullable: true,
        default: true
    })
    @AutoMap()
    description!: string;

    @Column(
        {
            type:"simple-enum",
            enum: ProfileVisibility,
            nullable: false,
            default: ProfileVisibility.ZERO
        }
    )
    @AutoMap()
    profileVisibility!: ProfileVisibility;

    @Column(
        {
            type: "int",
            nullable: false,
            default: -1
        }
    )
    @AutoMap()
    priority!: number;

    @Column(
        {
            type: "varchar",
            nullable: false
        }
    )
    @AutoMap()
    code!: string;

    @Column(
        {
            type:"int",
            nullable: false,
            default: 0
        }
    )
    @AutoMap()
    version!: number;

    @Column(
        {
            type:"int",
            nullable: false
        }
    )
    @AutoMap()
    priceInPaise!:number; // Rs 1 = 100 paise

    @Column(
        {
            type: "simple-enum",
            enum: PlanType,
            nullable: false
        }
    )
    @AutoMap()
    type!: PlanType;

    @Column(
        {
            type: "simple-enum",
            enum: PlanMasterStatus,
            nullable: false
        }
    )
    @AutoMap()
    status!: PlanMasterStatus;



    protected getPrefix(): string {
        return "pm";
    }

}