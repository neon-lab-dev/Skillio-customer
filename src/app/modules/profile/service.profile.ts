import { Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { Profile } from "../../entity/profile";
import { ProfileRepository } from "./repository.profile";


class ProfileService {

    private repository: ProfileRepository = new ProfileRepository();

    @Loggable()
    public async fetchWithPortfolio( id: string ): Promise<Profile> {
        let retVal = await this.repository.findByIdWithPortfolio(id);
        if (retVal){
            return retVal;
        }
        throw new NotFoundError(`Profile not found with id ${id}.`);
    }

}

export const profileService = new ProfileService();