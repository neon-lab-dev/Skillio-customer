import { PersistEntity } from "./PersistEntity";
import Decimal from "decimal.js"
import { Entity , OneToOne, Column, JoinColumn, Index } from "typeorm";
import { Portfolio } from "./portfolio";
import { DecimalTransformer } from "@neon-lab-dev/platform";

@Entity("hiringRate")
@Index("IDX_hourlyPricing" , ["hourlyPricing"])
@Index("IDX_dailyPricing" , ["dailyPricing"])
@Index("IDX_weeklyPricing" , ["weeklyPricing"])
@Index("IDX_monthlyPricing" , ["monthlyPricing"])
export class HiringRate extends PersistEntity{
    constructor(){
        super()
    }

    @Column("numeric",{
        transformer: DecimalTransformer
    })
    hourlyPricing!: Decimal;

    @Column("numeric",{
        transformer: DecimalTransformer
    })
    dailyPricing!: Decimal;

    @Column("numeric",{
        transformer: DecimalTransformer
    })
    weeklyPricing!: Decimal;

    @Column("numeric",{
        transformer: DecimalTransformer
    })
    monthlyPricing!: Decimal;

    @Column({type: "uuid"})
    portfolioId!: string;

    @OneToOne(()=>Portfolio , portfolio => portfolio.hiringRate , {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "portfolioId"})
    portfolio!: Portfolio

    protected getPrefix(): string {
        return "hr"
    }
}