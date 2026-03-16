import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { PersistEntity } from "./PersistEntity";
import { Category } from "./category";

@Entity("subCategory")
export class SubCategory extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type:"text",
        nullable:false,
        unique:true
    })
    name!:String

    @Column({
        type:"uuid",
        nullable:false,
        unique:true
    })
    categoryId!:String

    @ManyToOne(()=>Category , category=> category.subCategory,{
        onDelete:"CASCADE"
    })
    @JoinColumn({name: "categoryId"})
    category!: Category


    protected getPrefix(): string {
        return "subc"
    }
}