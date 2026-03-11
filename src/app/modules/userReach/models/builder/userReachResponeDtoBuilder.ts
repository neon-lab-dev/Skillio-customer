import { UserReach } from "../../../../entity/userReach";
import { globalMapper } from "../../../../mapper.global";
import { UserReachResponseDto } from "../response/userReachResponseDto";

export class UserReachResponseDtoBuilder{
    private dto: UserReachResponseDto;

    private constructor(){
        this.dto= new UserReachResponseDto()
    }

    public static builder():UserReachResponseDtoBuilder{
        return new UserReachResponseDtoBuilder()
    }

    public of(res: UserReach):UserReachResponseDtoBuilder{
        this.dto= globalMapper.map(res,UserReach , UserReachResponseDto);
        return this;
    }

    public build():UserReachResponseDto{
        return this.dto;
    }
}