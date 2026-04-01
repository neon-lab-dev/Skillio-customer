import { FcmToken } from "../../../../entity/fcmToken";
import { TokenRequest } from "../request/tokenRequet";

export class TokenBuilder{
    private entity: FcmToken;

    private constructor(){
        this.entity= new FcmToken;
    }

    public static builder(): TokenBuilder{
        return new TokenBuilder();
    }

    public of(req: TokenRequest): TokenBuilder{
        this.entity.userId= req.userId;
        this.entity.token!= req.token;

        return this;
    }

    public build(): FcmToken{
        return this.entity;
    }
}