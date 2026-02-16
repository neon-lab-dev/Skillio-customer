import { PersistEntity } from "./PersistEntity";
import { Column , Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Portfolio } from "./portfolio";


@Entity("follows")
@Index("IDX_instFollowers_facebookFollowers",["instaFollwers" , "facebookFollowers"])
@Index("IDX_instFollowing_facebookFollowing",["instaFollowing" , "facebookFollowing"])
export class Follows extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type: "int",
        nullable: true
    })
    instaFollwers?: number

    @Column({
        type: "int",
        nullable: true
    })
    instaFollowing?: number

    @Column({
        type: "int",
        nullable: true
    })
    facebookFollowers?: number

    @Column({
        nullable: true
    })
    facebookFollowing?: number

    @Column({type: "uuid"})
    portfolioId!: string

    @OneToOne(()=> Portfolio  ,portfolio=> portfolio.follows , {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "portfolioId"})
    portfolio!: Portfolio

    protected getPrefix(): string {
        return "fo"
    }
}
