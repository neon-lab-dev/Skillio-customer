import { AppDataSource } from "../db/dataSource";
import { Repository } from "typeorm";
import { Notification } from "../entity/notification";

class NotificationRepository{
    private notificationRepository: Repository<Notification>;

    constructor() {
        this.notificationRepository = AppDataSource.getRepository<Notification>("Notification");
    }

    // create a notification
    createNotification= async(notificationData: Partial<Notification>)=>{
        const newNotification=this.notificationRepository.create(notificationData);
        return this.notificationRepository.save(newNotification);
    }

    // find one by id
    findOne = async (id: string) => {
        return this.notificationRepository.findOne({
            where: {id}
        });
    }

    // update notification
    update = async (id: string, updateData: Partial<Notification>) => {
        return this.notificationRepository.update({id}, updateData);
    }

}

export default new NotificationRepository();