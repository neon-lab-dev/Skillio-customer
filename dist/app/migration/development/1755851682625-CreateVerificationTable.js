"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVerificationTable1755851682625 = void 0;
class CreateVerificationTable1755851682625 {
    constructor() {
        this.name = 'CreateVerificationTable1755851682625';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "purpose" character varying NOT NULL, "otpCode" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "otpCodeStatus" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "pin" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`DROP TABLE "verification"`);
        });
    }
}
exports.CreateVerificationTable1755851682625 = CreateVerificationTable1755851682625;
