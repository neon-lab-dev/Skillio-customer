import { AsyncContextService, Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { FetchPrivacyRequest } from "./models/request/fetchPrivacyRequest";
import { UpdatePrivacyRequest } from "./models/request/updatePrivacyRequest";
import { PrivacyDto } from "./models/response/privacyDto";
import { PrivacyRepository } from "./privacyRepository";
import { PrivacyDtoBuilder } from "./models/builder/privacyDtoBuilder";
import { Privacy } from "../../entity/privacy";

class PrivacyService{
    private repository: PrivacyRepository= new PrivacyRepository();

    private async checkExisting(id:string):Promise<Privacy>{
        const existing= await this.repository.findById(id);
        if(!existing){
            throw new NotFoundError("privacy entity does not exist");
        }
        return existing;
    }

    @Loggable()
    public async update(req: UpdatePrivacyRequest){
        await this.checkExisting(req.id);
        const updatedData= {
            type: req.type
        }
        return await this.repository.update(req.id , updatedData);
    }

    @Loggable()
    public async fetch(req: FetchPrivacyRequest):Promise<PrivacyDto>{
        const profileId= AsyncContextService.getUserId()
        const res= await this.repository.findByProfileId(profileId as string);
        if(!res){
            throw new NotFoundError("privacy entity not found");
        }
        return PrivacyDtoBuilder.builder().of(res).build();
    }
}

export default new PrivacyService()