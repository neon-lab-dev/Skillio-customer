import { NotFoundError } from "@neon-lab-dev/platform";
import { FcmToken } from "../../../entity/fcmToken";
import { TokenRepository } from "../../../repository/tokenRepository";
import { TokenBuilder } from "../models/builder/tokenBuilder";
import { TokenRequest } from "../models/request/tokenRequet";

class TokenService{

    private reposiotry: TokenRepository= new TokenRepository;

    private async findByUserId(req: TokenRequest): Promise<FcmToken | null>{
        return await this.reposiotry.findByUserId(req.userId);
    }

    public async fetchByUserId(req: TokenRequest): Promise<FcmToken>{
        const res= await this.reposiotry.findByUserId(req.userId);
        if(!res){
            throw new NotFoundError(`token not found for userId: ${req.userId}`);
        }

        return res;
    }

    public async createOrUpdate(req: TokenRequest){
        let entity= await this.findByUserId(req);
        if(entity){
            entity.token= req.token;
        }else{
            entity= TokenBuilder.builder().of(req).build();
        }

        const savedEntity=await this.reposiotry.save(entity);
        return savedEntity!;
    }
}

export default new TokenService();