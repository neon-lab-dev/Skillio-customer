"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVerificationTable1755851682625 = void 0;
class CreateVerificationTable1755851682625 {
    constructor() {
        this.name = 'CreateVerificationTable1755851682625';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "purpose" character varying NOT NULL, "otpCode" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "otpCodeStatus" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "pin" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "verification"`);
    }
}
exports.CreateVerificationTable1755851682625 = CreateVerificationTable1755851682625;
