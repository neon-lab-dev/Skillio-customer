import { AppDataSource } from "../db/dataSource";
import { Repository, In } from "typeorm";
import { Verification } from "../entity/verification";
import { OtpCodeStatus, verificationPurpose } from "../enums/verificationEnum";

class VerificationRepository {
  private verificationRepository: Repository<Verification>;

  constructor() {
    this.verificationRepository =
      AppDataSource.getRepository<Verification>("Verification");
  }

  // create a verification
  createVerification = async (verificationData: Partial<Verification>) => {
    const newVerification =
      this.verificationRepository.create(verificationData);
    return this.verificationRepository.save(newVerification);
  };

  // find one by id
  findOneById = async (id: string) => {
    return this.verificationRepository.findOneBy({
      id,
    });
  };

  // find One by phone number
  findOneByPhoneNUmberAndId = async (phoneNumber: string , verifciationId:string) => {
    return this.verificationRepository.findOneBy({
      phoneNumber,
        id: verifciationId
    });
  };

  // findOne by phoneNumber and purpose
  findOneByPhoneNumberAndPurpose = async (
    phoneNumber: string,
    purpose: verificationPurpose
  ) => {
    return this.verificationRepository.findOneBy({
      phoneNumber,
      purpose,
    });
  };

  // findOne by phoneNumber and otpCodeStatus in progress
findOneByPhoneNumberAndInProgressOrSent = async (
  phoneNumber: string,
  verificationId: string
) => {
  return this.verificationRepository.findOne({
    where: {
      id: verificationId,
      phoneNumber: phoneNumber,
      otpCodeStatus: In([OtpCodeStatus.IN_PROGRESS, OtpCodeStatus.SENT]),
    },
  });
};

  // update verification
  update = async (id: string, updateData: Partial<Verification>) => {
    return this.verificationRepository.update({ id }, updateData);
  };
}

export default new VerificationRepository();
