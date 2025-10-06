import { Entity , Column , Index } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { DocumentType ,DocumentStatus  } from "../modules/document/enums/documentEnum";


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

    @Column({nullable: true})
    profileId?: string;

}