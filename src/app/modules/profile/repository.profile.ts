import { BaseRepository } from "@neon-lab-dev/platform";
import { Profile } from "../../entity/profile";
import { AppDataSource } from "../../db/dataSource";

export class ProfileRepository extends BaseRepository<Profile> {

    constructor(){
        super(AppDataSource, Profile);
    }

    async findByIdWithPortfolio( id: string ): Promise<Profile | null> {
        return await this.repository.findOne({
            where: {
                id: id
            },
            relations: {
                portfolio: true
            }
        });
    }

}