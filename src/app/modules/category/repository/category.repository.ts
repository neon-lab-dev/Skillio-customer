import { BaseRepository } from "@neon-lab-dev/platform";
import { Category } from "../../../entity/category";
import { AppDataSource } from "../../../db/dataSource";

export class CategoryRepository extends BaseRepository<Category>{
    constructor(){
        super(AppDataSource , Category)
    }
}