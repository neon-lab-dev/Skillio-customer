import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { SubscriptionStatus } from "../userSubscription/enums/SubscriptionStatus";
import { PlanDetails } from "../userSubscription/models/dto/dto.plan.details";
import { AutoMap } from "@automapper/classes";
import { Sensitive , addDays } from "@neon-lab-dev/platform";
import { Profile } from "../../entity/profile";

@Entity(
    {
        name: "user_subscriptions"
    }
)
@Index(
    "IDX_PORFILE_ID", ["profileId"]
)
@Index(
    "IDX_PAYMENT_ID", ["paymentId"]
)
export class UserSubscriptionEntity extends PersistEntity {

    constructor() {
        super();
    }

    @Column({
        type: "varchar",
        nullable: false
    })
    @AutoMap()
    planCode!: string;

    @Column({
        name: "plan_details",
        type: "jsonb",
        nullable: false
    })
    @AutoMap()
    planDetails!: PlanDetails;

    @Column({
        type: "varchar"
    })
    @AutoMap()
    paymentId!: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    @AutoMap()
    paymentLink!: string;

    @Column({
        type: "timestamp",
        nullable: true
    })
    @AutoMap()
    startDate!: Date;

    @Column({
        type: "timestamp",
        nullable: true
    })
    @AutoMap()
    endDate!: Date;

    @Column({
        type: "simple-enum",
        enum: SubscriptionStatus,
        nullable: false,
        default: SubscriptionStatus.INITIATED
    })
    @AutoMap()
    status!: SubscriptionStatus;

    @ManyToOne(
        () => Profile,
        p => p.subscriptions,
        {
            onDelete: "CASCADE",
            eager: false
        }
    )
    @JoinColumn({
        foreignKeyConstraintName: "FK_PROFILE_ID",
        name:"profileId"
    })
    profile!: Promise<Profile>;

    @Column({
        type:"varchar"
    })
    profileId!: string;


    protected getPrefix(): string {
        return "subs";
    }


    @Sensitive()
    public setEndDate() {
        let planDetails = this.planDetails;
        if (planDetails){
            let validityDays = planDetails.validity;
            if (validityDays && this.startDate){
                this.endDate = addDays(this.startDate, validityDays);
            }
        }
    }

}