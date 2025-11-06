import { BaseEntity } from "./baseEntity";
import {  Entity , OneToMany } from "typeorm";
import { Message } from "./message";

@Entity("conversation")
export class Conversation extends BaseEntity{

    @OneToMany(()=>Message , message=>message.conversation,{
        cascade:true,
    })
    messages!: Message[];
    
}