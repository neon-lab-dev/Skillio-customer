import { Notification } from "../../../../entity/notification";
import { NotificationDto } from "../response/dto.notification";

export class NotificationDtoBuilder{
    private dto: NotificationDto;

    private constructor(){
        this.dto= new NotificationDto()
    }

    public static builder(): NotificationDtoBuilder{
        return new NotificationDtoBuilder()
    }

    public of(res: Notification): NotificationDtoBuilder{
        this.dto.bodyText= res.bodyText;
        return this;
    }

    public build(): NotificationDto{
        return this.dto
    }

    public ofArray(res: Notification[]): NotificationDto[]{
        return res.map(res=> NotificationDtoBuilder.builder().of(res).build())
    }
}