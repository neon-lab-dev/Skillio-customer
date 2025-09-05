"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const typeorm_1 = require("typeorm");
const verificationEnum_1 = require("../modules/verification/enums/verificationEnum");
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
                id,
            });
        };
        // find One by phone number
        this.findOneByPhoneNUmberAndId = async (phoneNumber, verifciationId) => {
            return this.verificationRepository.findOneBy({
                phoneNumber,
                id: verifciationId
            });
        };
        // findOne by phoneNumber and purpose
        this.findOneByPhoneNumberPurposeAndNonTerminating = async (phoneNumber, purpose) => {
            return this.verificationRepository.findOne({
                where: {
                    phoneNumber,
                    purpose,
                    otpCodeStatus: (0, typeorm_1.In)([verificationEnum_1.OtpCodeStatus.SENT, verificationEnum_1.OtpCodeStatus.IN_PROGRESS])
                }
            });
        };
        // findOne by phoneNumber and otpCodeStatus in progress
        this.findOneByIdAndInProgressOrSent = async (verificationId) => {
            return this.verificationRepository.findOne({
                where: {
                    id: verificationId,
                    otpCodeStatus: (0, typeorm_1.In)([verificationEnum_1.OtpCodeStatus.IN_PROGRESS, verificationEnum_1.OtpCodeStatus.SENT]),
                },
            });
        };
        // update verification
        this.update = async (id, updateData) => {
            return this.verificationRepository.update({ id }, updateData);
        };
        this.verificationRepository =
            dataSource_1.AppDataSource.getRepository("Verification");
    }
}
exports.default = new VerificationRepository();
