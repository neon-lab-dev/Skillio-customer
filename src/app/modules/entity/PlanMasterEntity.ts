import { Column, Entity } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { PlanType } from "../planMaster/enum/PlanType";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";

@Entity(
    {
        name: "plan_masters"
    }
)
export class PlanMasterEntity extends PersistEntity {

    constructor() {
        super();
    }

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    callLimits!: Number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    chatLimits!: Number;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    validity!: Number;

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
            nullable: true,
            default: -1
        }
    )
    priority!: Number;

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
    version!: Number;

    @Column(
        {
            type: "simple-enum",
            enum: PlanType,
            nullable: false
        }
    )
    type!: PlanType;



    protected getPrefix(): string {
        return "pm";
    }

}