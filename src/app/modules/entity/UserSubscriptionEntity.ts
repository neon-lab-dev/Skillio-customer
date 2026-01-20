import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PersistEntity } from "../../entity/PersistEntity";
import { SubscriptionStatus } from "../userSubscription/enums/SubscriptionStatus";
import { PlanDetails } from "../userSubscription/models/dto/dto.plan.details";
import { Portfolio } from "../../entity/portfolio";


@Entity(
    {
        name: "user_subscriptions"
    }
)
@Index(
    "IDX_PORTFOLIO_ID", ["portfolioId"]
)
export class UserSubscriptionEntity extends PersistEntity {
    
    constructor(){
        super();
    }
   
    @Column({
        type: "varchar",
        nullable: false
    })
    planCode!: string;

    @Column({
        name: "plan_details",
        type: "jsonb",
        nullable: false
    })
    planDetails!: PlanDetails;

    @Column({
        type: "timestamp",
        nullable: true
    })
    startDate!:Date;

    @Column({
        type: "timestamp",
        nullable: true
    })
    endDate!: Date;
    
    @Column({
        type: "simple-enum",
        enum: SubscriptionStatus,
        nullable: false,
        default: SubscriptionStatus.INITIATED
    })
    status!: SubscriptionStatus;

    @ManyToOne(
        () => Portfolio,
        p => p.subscriptions,
        {
            onDelete: "CASCADE",
            eager: false
        }
    )
    portfolio!: Promise<Portfolio>;

    @JoinColumn({
        name: "porfolio_id",
        foreignKeyConstraintName: "FK_PORTFOLIO_ID",
    })
    portfolioId!: string;

    
    
    protected getPrefix(): string {
        return "subs";
    }
}