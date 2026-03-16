import { PersistEntity } from "./PersistEntity";
import { Entity , Column, OneToMany } from "typeorm";
import { SubCategory } from "./subCategory";

@Entity("category")
export class Category extends PersistEntity{
    constructor(){
        super()
    }

    @Column({
        type:"text",
        unique:true,
        nullable:false
    })
    name!:String

    @OneToMany(()=> SubCategory , subCategory=> subCategory.category,{
        cascade:true,
        lazy: true
    })
    subCategory?: SubCategory[]

    protected getPrefix(): string {
        return "cat"
    }

}