import registrationServices from "./registration.services";
import { TProfile } from "./interface/registration.interface";
import registrationRepository from "../../repository/registrationRepository";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import documentRepository from "../../repository/documentRepository";
import { DocumentType } from "../document/enums/documentEnum";
import { proxyLogging } from "../../utils/proxyLogging";


class RegistrationProxy{

    private checkExistingDocument= async(documentId:string , documentType:DocumentType)=>{
        const existingDocument= await documentRepository.findByIdAndType(documentId , documentType);

        if(!existingDocument){
            logger.error(`${documentType} with this Id doesnot exist`);
            throw new AppError(404, `${documentType} doesnot exist`);
        }
    }

    createProfile= proxyLogging(
        "RegistrationProxy",
        "createProfile",
        async(profileData:TProfile)=>{
        const { nickName , contacts , profileDocumentId , portfolio}=profileData;

        const existingProfile= await registrationRepository.findProfileByCredential(nickName);

        if(existingProfile){
            logger.error("Profile with this nickname already exists");
            throw new AppError(409, "Profile with this nickname already exists");
        }

        const existingProfileByContact= await Promise.all(contacts.map(async(contact)=>{
            return await registrationRepository.findProfileByContactValue(contact.value)
        }));

        if(existingProfileByContact.some(profile=>profile!==null)){
            logger.error("Profile with these contacts value already exists");
            throw new AppError(409, `Profile with these contacts already exists`);
        }

        await this.checkExistingDocument(profileDocumentId , DocumentType.PROFILE_PHOTO);

        await this.checkExistingDocument(portfolio.videoDocumentId , DocumentType.VIDEO);

        await this.checkExistingDocument(portfolio.imageDocumentId , DocumentType.IMAGE);

        if(portfolio.eventsDoneDocumentId){
            await this.checkExistingDocument(portfolio.eventsDoneDocumentId , DocumentType.EVENT);
        }

        return await registrationServices.createProfile(profileData);
    })

    loginUser= proxyLogging(
        "RegistrationProxy",
        "loginUser",
        async(credential:string , pin:string)=>{
        const profile= await registrationRepository.findProfileByCredential(credential);
        
        if(!profile){
            logger.error(`  Profile doesnot exist.`);
            throw new AppError(404, `Profile doesnot exist.`);
        }

        return await registrationServices.loginUser(pin , profile)
    })

    // get profile
    getProfile= proxyLogging(
        "RegistrationProxy",
        "getProfile",
        async(id:string)=>{
        return await registrationServices.getProfile(id);
    })

    // get profiles
    getProfiles= proxyLogging(
        "RegistrationProxy",
        "getProfiles",
        async(page:string , limit: string)=>{
        return await registrationServices.getProfiles(page , limit);
    })
}

export default new RegistrationProxy();