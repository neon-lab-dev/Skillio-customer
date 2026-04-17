import { AppDataSource } from "../db/dataSource";
import { Repository, In } from "typeorm";
import { Verification } from "../entity/verification";
import { OtpCodeStatus, verificationPurpose } from "../modules/verification/enums/verificationEnum";

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
    return await this.verificationRepository.save(newVerification);
  };

  // find one by id
  findOneById = async (id: string) => {
    return await this.verificationRepository.findOneBy({
      id,
    });
  };

  // find One by phone number
  findOneByPhoneNUmberAndId = async (phoneNumber: string , verifciationId:string) => {
    return await this.verificationRepository.findOneBy({
      phoneNumber,
        id: verifciationId
    });
  };

  // findOne by phoneNumber and purpose
  findOneByPhoneNumberAndNonTerminating = async (
    phoneNumber: string,
  ) => {
    return await this.verificationRepository.findOne({
      where:{
        phoneNumber,
        otpCodeStatus: In([OtpCodeStatus.SENT, OtpCodeStatus.IN_PROGRESS])
      }
    });
  };

  // findOne by phoneNumber and otpCodeStatus in progress
findOneByIdAndInProgressOrSent = async (
  verificationId: string
) => {
  return await this.verificationRepository.findOne({
    where: {
      id: verificationId,
      otpCodeStatus: In([OtpCodeStatus.IN_PROGRESS, OtpCodeStatus.SENT]),
    },
  });
};

  // update verification
  update = async (id: string, updateData: Partial<Verification>) => {
    return await this.verificationRepository.update({ id }, updateData);
  };

  async findOneByPhoneNumber(phoneNumber:string){
    return await this.verificationRepository.findOneBy({
      phoneNumber,
    })
  }
}

export default new VerificationRepository();
