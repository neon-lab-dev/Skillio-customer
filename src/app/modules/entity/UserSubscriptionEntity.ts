import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { SubscriptionStatus } from "../userSubscription/enums/SubscriptionStatus";
import { PlanDetails } from "../userSubscription/models/dto/dto.plan.details";
import { Portfolio } from "../../entity/portfolio";
import { string } from "zod";
import { AutoMap } from "@automapper/classes";


@Entity(
    {
        name: "user_subscriptions"
    }
)
@Index(
    "IDX_PORTFOLIO_ID", ["portfolioId"]
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
        () => Portfolio,
        p => p.subscriptions,
        {
            onDelete: "CASCADE",
            eager: false
        }
    )
    @JoinColumn({
        foreignKeyConstraintName: "FK_PORTFOLIO_ID",
    })
    portfolio!: Promise<Portfolio>;

    @Column({
        type:"varchar"
    })
    portfolioId!: string;



    protected getPrefix(): string {
        return "subs";
    }
}