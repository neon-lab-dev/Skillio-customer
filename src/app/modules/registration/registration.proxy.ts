import registrationServices from "./registration.services";
import { TProfile } from "./interface/registration.interface";
import registrationRepository from "../../repository/registrationRepository";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";


class RegistrationProxy{
    createProfile= async(profileData:TProfile)=>{
        const { nickName , contacts}=profileData;

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

        return await registrationServices.createProfile(profileData);
    }

    loginUser= async(credential:string , pin:string)=>{
        const profile= await registrationRepository.findProfileByCredential(credential);
        
        if(!profile){
            logger.error(`Profile doesnot exist.`);
            throw new AppError(404, `Profile doesnot exist.`);
        }

        return await registrationServices.loginUser(pin , profile)
    }
}

export default new RegistrationProxy();