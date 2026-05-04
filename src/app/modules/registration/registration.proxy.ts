import { TProfile } from "./interface/registration.interface";
import registrationServices from "./registration.services";
import registrationRepository from "../../repository/registrationRepository";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import documentRepository from "../../repository/documentRepository";
import { DocumentType } from "../document/enums/documentEnum";
import { proxyLogging } from "../../utils/proxyLogging";
import { profileStatus } from "./enums/registrationEnum";
import { AppValidationError, ERROR_CODES, LoggerService, NotFoundError } from "@neon-lab-dev/platform";


class RegistrationProxy{

    private checkExistingDocument= async(documentId:string , documentType:DocumentType)=>{
        const existingDocument= await documentRepository.findByIdAndType(documentId , documentType);

        if(!existingDocument){
            logger.error(`${documentType} with this Id doesnot exist`);
            throw new AppError(404, `${documentType} doesnot exist`);
        }
    }

    registerProfile= proxyLogging(
        "RegistrationProxy",
        "registerProfile",
        async(profileData:TProfile)=>{
        const { profileDetails , contacts, profileDocumentId , portfolio}=profileData;

        const existingProfile= await registrationRepository.findProfileByCredential(profileDetails?.nickName!);

        if(existingProfile && existingProfile.isCreator){
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

        await Promise.all(
            portfolio.videoDocumentIds.map(async(video)=>{
                await this.checkExistingDocument(video , DocumentType.VIDEO)
            })
        )

        await Promise.all(
            portfolio.imageDocumentIds.map(async(image)=>{
                await this.checkExistingDocument(image , DocumentType.IMAGE);
            })
        )

        if(portfolio.eventsDoneDocumentIds){
            await Promise.all(
                portfolio.eventsDoneDocumentIds.map(async(event)=>{
                await this.checkExistingDocument(event , DocumentType.EVENT)
            })
        )
        }

        return await registrationServices.registerProfile(profileData);
    })

    loginUser= proxyLogging(
        "RegistrationProxy",
        "loginUser",
        async(credential:string , pin:string)=>{
        const profile= await registrationRepository.findProfileByCredential(credential);
        
        if(!profile){
            LoggerService.error(`  Profile doesnot exist`);
            throw new NotFoundError(`Profile doesnot exist `);
        }

        if(profile.profileDetails&& profile.profileDetails.status=== profileStatus.BLOCKED){
            throw new AppValidationError("You are blocked on  this platform" , ERROR_CODES.ACCESS_DENIED)
        }

        if(!profile.pin){
            throw new AppValidationError("Can not login with pin , pin not set", ERROR_CODES.ACCESS_DENIED)
        }

        return await registrationServices.loginUser(pin , profile)
    })

    // get profile
    getShortProfile= proxyLogging(
        "RegistrationProxy",
        "getProfile",
        async(id:string)=>{
        return await registrationServices.getShortProfile(id);
    })


    // get profile count
    getProfileCount= proxyLogging(
        "RegistrationProxy",
        "getProfileCount",
        async()=>{
            return await registrationServices.getProfileCount();
        }
    )
}

export default new RegistrationProxy();