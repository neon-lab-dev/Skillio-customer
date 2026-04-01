import { BaseRepository } from "@neon-lab-dev/platform";
import { SubCategory } from "../../../entity/subCategory";
import { AppDataSource } from "../../../db/dataSource";

export class SubCategoryRepository extends BaseRepository<SubCategory>{
    constructor(){
        super(AppDataSource , SubCategory)
    }

    async findByCategoryId(categoryId:string):Promise<SubCategory[]>{
        return this.repository.findBy({
            categoryId
        })
    }
       async findByNameAndCategoryId(
        name: string,
        categoryId: string
    ): Promise<SubCategory | null> {
        return this.repository.findOneBy({ 
            name, 
            categoryId, 
            deleted: false 
        })
    } 

}