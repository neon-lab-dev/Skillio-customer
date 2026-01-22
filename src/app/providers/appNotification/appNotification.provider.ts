import { LoggerService } from "@neon-lab-dev/platform";
import { Notification } from "../../entity/notification";
import { getIO, onlineUsers } from "../../utils/sockets";
import { NotificationProvider, ProviderResult } from "../interface/notification.provider.interface";

export class AppNotificationProvider implements NotificationProvider{

    public async send(notificaion:Notification): Promise<ProviderResult>{
        const io= getIO();

        const socketId= onlineUsers.get(notificaion.to as string);

        if(socketId){
            io.to(socketId).emit("notification" , notificaion.bodyText);

            LoggerService.info(`notification sent to recipientId: ${notificaion.to}`)
        }

        return{
            ok: true
        }
    }
}