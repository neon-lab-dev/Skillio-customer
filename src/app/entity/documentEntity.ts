import { Entity , Column , Index, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { DocumentType ,DocumentStatus  } from "../modules/document/enums/documentEnum";
import { Profile } from "./profile";
import { Portfolio } from "./portfolio";

@Entity("document")
@Index("IDX_TYPE_STATUS" , ["type" , "status"])
@Index("IDX_ID_TYPE_STATUS", ["id" , "type" , "status"])
export class Document extends BaseEntity{
    @Column()
    fileName!: string;

    @Column()
    url!: string;

    @Column()
    mimeType!: string;

    @Column()
    remarks?: string;

    @Column({type: "enum", enum: DocumentType})
    type!: DocumentType;

    @Column({type:"enum" , enum: DocumentStatus})
    status!: DocumentStatus;

    @Column({nullable: true , type:"uuid"})
    profileId?: string;

    @OneToOne(() => Profile, profile => profile.profilePhoto,{
        nullable: true,
        onDelete:"CASCADE",
    })
    @JoinColumn({name: "profileId"})
    profile?: Profile;

    @Column({nullable:true , type:"uuid"})
    portfolioVideoId?: string;

    @OneToOne(()=>Portfolio , portfolio=> portfolio.video , {
        nullable:true,
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"portfolioVideoId"})
    portfolioVideo?: Portfolio;

    @Column({nullable:true , type:"uuid"})
    portfolioImageId?: string;

    @OneToOne(()=>Portfolio , portfolio=> portfolio.image , {
        nullable:true,
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"portfolioImageId"})
    video?: Portfolio;

    @Column({nullable:true , type:"uuid"})
    portfolioEventsDoneId?: string;

    @OneToOne(()=>Portfolio , portfolio=> portfolio.eventsDone , {
        nullable:true,
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"portfolioEventsDoneId"})
    eventsDone?: Portfolio;
}