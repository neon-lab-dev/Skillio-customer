import { BaseRepository } from "@neon-lab-dev/platform";
import { ProfileDetails } from "../entity/profileDetails";
import { AppDataSource } from "../db/dataSource";

export class ProfileDetailsRepository extends BaseRepository<ProfileDetails>{
    constructor(){
        super(AppDataSource , ProfileDetails)
    }
}