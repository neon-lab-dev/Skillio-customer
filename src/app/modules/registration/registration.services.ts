import { Contact } from "../../entity/contact";
import registrationRepository from "../../repository/registrationRepository";
import verificationRepository from "../../repository/verificationRepository";
import { logger } from "../../utils/logger";
import { getJwtConfig } from "./config/jwtConfig";
import { TProfile } from "./interface/registration.interface";
import { GetProfileDTO, GetRegistrationDTO } from "./registration.dto";
import bcrypt from "bcrypt";
import { TDocument } from "../document/interface/document.interface";
import documentRepository from "../../repository/documentRepository";
import { Profile } from "../../entity/profile";
import AppError from "../../errors/appError";
import { DocumentType } from "../document/enums/documentEnum";
import { ProfileType } from "./enums/registrationEnum";
import { getFullName } from "./utils/getFullName";
import { serviceLogging } from "../../utils/serviceLogging";
import { JwtService } from "@neon-lab-dev/platform";

class RegistraionService{
    private updateContactVerificationStatus= async(id:string , contactData: Partial<Contact>)=>{
        await registrationRepository.updateContactById(id, contactData);
    }

    private updateDocument=async(id:string , documentData:Partial<TDocument>)=>{
        await documentRepository.updateDocument(id, documentData);
    }


    // create/register a profile
    createProfile= serviceLogging(
        "RegistrationService",
        "createProfile",
        async(profileData:TProfile)=>{
        const {firstName , lastName , groupName , nickName , pin , profileType , contacts , address , portfolio , profileDocumentId}=profileData;

        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(pin, salt);

        const newProfile= await registrationRepository.createProfile({
            firstName,
            lastName,
            groupName,
            nickName,
            pin:hashedPin,
            profileType , 
            contacts: contacts.map(contact=>({
                type:contact.type,
                value:contact.value,
                primary:contact.primary,
            })),
            address:{
                streetAddress: address.streetAddress,
                city: address.city,
                state: address.state,
                country: address.country,
                pinCode: address.pinCode,
                location: address.location
            }, 
            portfolio:{
                category: portfolio.category,
                subCategory: portfolio.subCategory,
                proficiency: portfolio.proficiency,
                totalEvents: portfolio.totalEvents,
                bio: portfolio.bio || ""
            }
        })

        Promise.all(contacts.map(async(contact)=>{
            const verification= await verificationRepository.findOneById(contact.verificationId);
            const existingContact= await registrationRepository.findContactByValue(contact.value);
            if(verification?.otpCodeStatus==="VERIFIED"){
                await this.updateContactVerificationStatus(existingContact!.id , {
                    isVerified:true
                })
            }else{
                await this.updateContactVerificationStatus(existingContact!.id , {
                    isVerified:false
                })
            }
        }))

        await this.updateDocument(profileDocumentId , {
            portfolioId: newProfile.portfolio.id
        })

        await this.updateDocument(portfolio.videoDocumentId, {
            portfolioId: newProfile.portfolio.id
        })

        await this.updateDocument(portfolio.imageDocumentId , {
            portfolioId: newProfile.portfolio.id
        })

        if(portfolio.eventsDoneDocumentId){
            await this.updateDocument(portfolio.eventsDoneDocumentId , {
                portfolioId: newProfile.portfolio.id
            })
        }

        const profile= new GetRegistrationDTO(newProfile).toJSON();

        return profile;
    })


    // login a user
    loginUser= serviceLogging(
        "RegistrationService",
        "loginUser",
        async( pin:string , profile:Profile)=>{

        const isPinMatch= await bcrypt.compare(pin, profile.pin);

        if(!isPinMatch){
            logger.error(`Pin doesnot match , please try again.`);
            throw new AppError(400, `Pin doesnot match , please try again.`);
        }

        const jwtPayload={
            profileId: profile.id,
            nickName: profile.nickName,
            role: profile.role
        }

        const jwtConfig= await getJwtConfig();

        const acessToken=JwtService.createToken(
            jwtPayload,
            jwtConfig.JWT_ACCESS_SECRET,
            jwtConfig.JWT_ACCESS_EXPIRES_IN
        )

        const refreshToken=JwtService.createToken(
            jwtPayload,
            jwtConfig.JWT_REFRESH_SECRET,
            jwtConfig.JWT_REFRESH_EXPIRES_IN
        )

        return{
            profile:{
                id: profile.id,
                nickName: profile.nickName
            },
            accessToken: acessToken,
            refreshToken: refreshToken
        }
    })

    // get profile
    getProfile= serviceLogging(
        "RegistrationService",
        "getProfile",
        async(id:string)=>{
        const profile= await registrationRepository.findProfileById(id);

        if(!profile){
            logger.error("Profile with this Id doesnot exist");
            throw new AppError(404, "Profile does not exist");
        }

        const fetchedProfile= new GetProfileDTO(profile).toJSON();

        const profilePhotoId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.PROFILE_PHOTO);


        if(fetchedProfile.profileType===ProfileType.INDIVIDUAL){
            const name= getFullName(fetchedProfile.firstName as string, fetchedProfile.lastName as string);
            
                if(fetchedProfile.isSubscribed){
                    return {
                    name: name,
                    nickName: fetchedProfile.nickName,
                    portfolioId: fetchedProfile.portfolio.id,
                    bio: fetchedProfile.portfolio.bio || "",
                    isSubscribed:  fetchedProfile.isSubscribed,
                    profilePictureId: profilePhotoId,
                    online:fetchedProfile.online,
                    propritaryDetails:{
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phoneNumber: profile.contacts.find(contact=>contact.type==="PHONE")?.value,
                        email: profile.contacts.find(contact=>contact.type==="EMAIL")?.value,
                        } 
                    }
                }else{
                    return{
                    name: name,
                    nickName: fetchedProfile.nickName,
                    portfolioId: fetchedProfile.portfolio.id,
                    bio: fetchedProfile.portfolio.bio || "",
                    isSubscribed:  fetchedProfile.isSubscribed,
                    profilePictureId: profilePhotoId,
                    online:fetchedProfile.online,
                    }
                }
            }
        else{
                if(fetchedProfile.isSubscribed){
                    return{
                    profile:{
                        groupName: fetchedProfile.groupName,
                        nickName: fetchedProfile.nickName,
                        portfolioId: fetchedProfile.portfolio.id,
                        bio: fetchedProfile.portfolio.bio || "",
                        isSubscribed: fetchedProfile.isSubscribed,
                        online:fetchedProfile.online,
                    },
                    profilePictureId: profilePhotoId,
                    propritaryDetails:{
                        groupName: profile.groupName,
                        phoneNumber: profile.contacts.find(contact=>contact.type==="PHONE")?.value,
                        email: profile.contacts.find(contact=>contact.type==="EMAIL")?.value,
                        }
                    }
                }else{
                    return{
                    profile:{
                        groupName: fetchedProfile.groupName,
                        nickName: fetchedProfile.nickName,
                        portfolioId: fetchedProfile.portfolio.id,
                        online:fetchedProfile.online,
                        bio: fetchedProfile.portfolio.bio || "",
                        isSubscribed: fetchedProfile.isSubscribed
                        },
                    profilePictureId: profilePhotoId
                    }
                }
        }
    })

    // get profiles
    getProfiles= serviceLogging(
        "RegistrationService",
        "getProfiles",
        async(page: string , limit: string)=>{
        const profiles= await  registrationRepository.findAllProfiles(page , limit);

        const fetchedProfiles= profiles.map(profile=> new GetProfileDTO(profile).toJSON());

        const shortProfiles=  Promise.all(fetchedProfiles.map(async(profile)=>{
            if(profile.profileType===ProfileType.INDIVIDUAL){
                const name= getFullName(profile.firstName as string, profile.lastName as string);
                const profilePhotoId= await documentRepository.findDocumentIdByPortfolioIdAndType(profile.portfolio.id , DocumentType.PROFILE_PHOTO);
                return{
                        name: name,
                        nickName: profile.nickName,
                        profilePcitureId: profilePhotoId,
                }
            }else{
                const profilePhotoId= await documentRepository.findDocumentIdByPortfolioIdAndType(profile.portfolio.id , DocumentType.PROFILE_PHOTO);
                return{
                    groupName: profile.groupName,
                    nickName: profile.nickName,
                    profilePcitureId: profilePhotoId,
                }
            }
        }))

        return shortProfiles;
    })

}

export default new RegistraionService();