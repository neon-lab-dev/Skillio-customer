import { AppDataSource } from "../db/dataSource";
import { Repository } from "typeorm";
import { Verification } from "../entity/verification";
import { OtpCodeStatus } from "../enums/verificationEnum";

class VerificationRepository{
    private verificationRepository: Repository<Verification>;

    constructor() {
        this.verificationRepository = AppDataSource.getRepository<Verification>("Verification");
    }

    // create a verification
    createVerification= async(verificationData: Partial<Verification>)=>{
        const newVerification=this.verificationRepository.create(verificationData);
        return this.verificationRepository.save(newVerification);
    }

    // find one by id
    findOneById= async(id: string)=>{
        return this.verificationRepository.findOneBy({
            id
        });
    }

    // find One by phone number
    findOneByPhoneNUmber= async(phoneNumber: string)=>{
        return this.verificationRepository.findOneBy({
            phoneNumber
        })
    }

    // findOne by phoneNumber and otpCodeStatus in progress
    findOneByPhoneNumberIdAndInProgress= async(phoneNumber: string  ,verifciationId:string)=>{
        return this.verificationRepository.findOneBy({
            id: verifciationId,
            phoneNumber,
            otpCodeStatus: OtpCodeStatus.IN_PROGRESS
        })
    }


    // update verification
    update= async(id: string , updateData: Partial<Verification>)=>{
        return this.verificationRepository.update({id}, updateData);
    }

}

export default new VerificationRepository();