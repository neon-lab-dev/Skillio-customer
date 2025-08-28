import { MigrationInterface, QueryRunner } from "typeorm";

export class Customer1756297042672 implements MigrationInterface {
    name = 'Customer1756297042672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "purpose" character varying NOT NULL, "otpCode" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "otpCodeStatus" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "pin" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_medium_enum" AS ENUM('EMAIL', 'SMS', 'PUSH_NOTIFICATION')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('IN_PROGRESS', 'SENT', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "medium" "public"."notification_medium_enum" NOT NULL, "Phone" character varying, "Email" character varying, "DeviceToken" character varying, "bodyText" jsonb NOT NULL, "attachments" jsonb, "status" "public"."notification_status_enum" NOT NULL DEFAULT 'IN_PROGRESS', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."system_config_medium_enum" AS ENUM('EMAIL', 'SMS', 'PUSH_NOTIFICATION')`);
        await queryRunner.query(`CREATE TABLE "system_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerName" character varying NOT NULL, "medium" "public"."system_config_medium_enum" NOT NULL, "apiKey" character varying NOT NULL, "apiSecret" character varying, "twilioPhoneNumber" character varying NOT NULL, CONSTRAINT "PK_db4e70ac0d27e588176e9bb44a0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "system_config"`);
        await queryRunner.query(`DROP TYPE "public"."system_config_medium_enum"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_medium_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "verification"`);
    }

}
