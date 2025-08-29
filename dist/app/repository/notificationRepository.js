"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class NotificationRepository {
    constructor() {
        // create a notification
        this.createNotification = async (notificationData) => {
            const newNotification = this.notificationRepository.create(notificationData);
            return this.notificationRepository.save(newNotification);
        };
        // find one by id
        this.findOne = async (id) => {
            return this.notificationRepository.findOne({
                where: { id }
            });
        };
        // update notification
        this.update = async (id, updateData) => {
            return this.notificationRepository.update({ id }, updateData);
        };
        this.notificationRepository = dataSource_1.AppDataSource.getRepository("Notification");
    }
}
exports.default = new NotificationRepository();
