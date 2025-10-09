import { Entity , Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { proficiecy } from "../modules/registration/enums/registrationEnum";
import { Profile } from "./profile";
import { Document } from "./documentEntity";

@Entity("portfolio")
export class Portfolio extends BaseEntity{
    @Column()
    category!: string;

    @Column()
    subCategory!: string;

    @Column({type:"enum", enum: proficiecy})
    proficiency!: proficiecy;

    @Column({nullable:true})
    totalEvents?: number;

    @Column({nullable:true})
    bio?: string;

    @OneToOne(()=>Document)
    video!: Document;

    @OneToOne(()=>Document)
    image!: Document;

    @OneToOne(()=>Document , {nullable:true})
    eventsDone?: Document;

    @Column({type:"uuid"})
    profileId!: string;

    @OneToOne(()=>Profile , profile=>profile.portfolio)
    @JoinColumn({name:"profileId"})
    profile!: Profile;

}