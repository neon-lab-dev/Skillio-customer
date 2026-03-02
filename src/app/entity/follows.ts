import { PersistEntity } from "./PersistEntity";
import { Column , Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Portfolio } from "./portfolio";
import { SocialMeida } from "../modules/registration/enums/registrationEnum";
import { AutoMap } from "@automapper/classes";


@Entity("follows")
export class Follows extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type: "enum" ,
        enum:SocialMeida ,
        default:SocialMeida.FACEBOOK,
        nullable:false
    })
    @AutoMap()
    socialMedia!: SocialMeida

    @Column({
        type:"text",
        nullable:false
    })
    @AutoMap()
    link!: string

    @Column({
        type:"int",
        nullable:true,
        default:0
    })
    followers?:number

    @Column({
        type:"int",
        nullable:true,
        default:0
    })
    following?:number


    @Column({type: "uuid"})
    portfolioId!: string

    @ManyToOne(()=> Portfolio  ,portfolio=> portfolio.follows , {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "portfolioId"})
    portfolio!: Portfolio

    protected getPrefix(): string {
        return "fo"
    }
}
