"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const verificationEnum_1 = require("../enums/verificationEnum");
class VerificationRepository {
    constructor() {
        // create a verification
        this.createVerification = async (verificationData) => {
            const newVerification = this.verificationRepository.create(verificationData);
            return this.verificationRepository.save(newVerification);
        };
        // find one by id
        this.findOneById = async (id) => {
            return this.verificationRepository.findOneBy({
                id
            });
        };
        // find One by phone number
        this.findOneByPhoneNUmber = async (phoneNumber) => {
            return this.verificationRepository.findOneBy({
                phoneNumber
            });
        };
        // findOne by phoneNumber and otpCodeStatus in progress
        this.findOneByPhoneNumberIdAndInProgress = async (phoneNumber, verifciationId) => {
            return this.verificationRepository.findOneBy({
                id: verifciationId,
                phoneNumber,
                otpCodeStatus: verificationEnum_1.OtpCodeStatus.IN_PROGRESS
            });
        };
        // update verification
        this.update = async (id, updateData) => {
            return this.verificationRepository.update({ id }, updateData);
        };
        this.verificationRepository = dataSource_1.AppDataSource.getRepository("Verification");
    }
}
exports.default = new VerificationRepository();
