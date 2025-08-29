"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesNotificationAndVerificationTable1756463452615 = void 0;
class UpdatesNotificationAndVerificationTable1756463452615 {
    constructor() {
        this.name = 'UpdatesNotificationAndVerificationTable1756463452615';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deviceToken"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "attempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "to" character varying`);
        await queryRunner.query(`ALTER TABLE "system_config" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "system_config" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "purpose"`);
        await queryRunner.query(`CREATE TYPE "public"."verification_purpose_enum" AS ENUM('LOGIN', 'PHONE_VERIFICATION', 'EMAIL_VERIFICATION', 'SIGNUP')`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "purpose" "public"."verification_purpose_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "otpCodeStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."verification_otpcodestatus_enum" AS ENUM('SENT', 'VERIFIED', 'EXPIRED', 'IN_PROGRESS')`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "otpCodeStatus" "public"."verification_otpcodestatus_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "bodyText"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "bodyText" text`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "attachments" text array`);
        await queryRunner.query(`ALTER TABLE "system_config" ALTER COLUMN "apiKey" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "system_config" ALTER COLUMN "twilioPhoneNumber" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "system_config" ALTER COLUMN "twilioPhoneNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "system_config" ALTER COLUMN "apiKey" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "bodyText"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "bodyText" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "otpCodeStatus"`);
        await queryRunner.query(`DROP TYPE "public"."verification_otpcodestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "otpCodeStatus" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "purpose"`);
        await queryRunner.query(`DROP TYPE "public"."verification_purpose_enum"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "purpose" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "system_config" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "system_config" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "to"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "attempts"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deviceToken" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "phone" character varying`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }
}
exports.UpdatesNotificationAndVerificationTable1756463452615 = UpdatesNotificationAndVerificationTable1756463452615;
