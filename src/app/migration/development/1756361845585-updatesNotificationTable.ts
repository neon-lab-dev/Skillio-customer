import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesNotificationTable1756361845585 implements MigrationInterface {
    name = 'UpdatesNotificationTable1756361845585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "Phone"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "Email"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "DeviceToken"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deviceToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deviceToken"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "DeviceToken" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "Email" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "Phone" character varying`);
    }

}
