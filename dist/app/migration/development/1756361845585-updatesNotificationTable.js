"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesNotificationTable1756361845585 = void 0;
class UpdatesNotificationTable1756361845585 {
    constructor() {
        this.name = 'UpdatesNotificationTable1756361845585';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "Phone"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "Email"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "DeviceToken"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deviceToken" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deviceToken"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "DeviceToken" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "Email" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "Phone" character varying`);
    }
}
exports.UpdatesNotificationTable1756361845585 = UpdatesNotificationTable1756361845585;
