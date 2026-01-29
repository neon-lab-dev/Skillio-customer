import { AppDataSource } from "../db/dataSource";
import { Notification } from "../entity/notification";
import { BaseRepository } from "@neon-lab-dev/platform";

class NotificationRepository extends BaseRepository<Notification>{

    constructor(){
        super(AppDataSource , Notification)
    }

    // create a notification
    createNotification= async(notificationData: Partial<Notification>)=>{
        const newNotification=this.repository.create(notificationData);
        return await this.repository.save(newNotification);
    }

    // find one by id
    findOne = async (id: string) => {
        return await this.repository.findOne({
            where: {id}
        });
    }

    // update notification
    update = async (id: string, updateData: Partial<Notification>) => {
        return await this.repository.update({id}, updateData);
    }

}

export default new NotificationRepository();