import { Entity , Column , Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { DocumentType ,DocumentStatus  } from "../modules/document/enums/documentEnum";
import { Portfolio } from "./portfolio";
import { AutoMap } from "@automapper/classes";

@Entity("document")
@Index("IDX_TYPE_STATUS" , ["type" , "status"])
@Index("IDX_ID_TYPE_STATUS", ["id" , "type" , "status"])
export class Document extends BaseEntity{
    @Column()
    fileName!: string;

    @Column()
    @AutoMap()
    url!: string;

    @Column()
    @AutoMap()
    mimeType!: string;

    @Column()
    @AutoMap()
    remarks?: string;

    @Column({type: "enum", enum: DocumentType})
    @AutoMap()
    type!: DocumentType;

    @Column({type:"enum" , enum: DocumentStatus})
    @AutoMap()
    status!: DocumentStatus;

    @Column({nullable:true , type:"uuid"})
    @AutoMap()
    portfolioId?: string;

    @ManyToOne(()=>Portfolio , portfolio=> portfolio.document)
    @JoinColumn({name:"portfolioId"})
    portfolio?: Portfolio;
}