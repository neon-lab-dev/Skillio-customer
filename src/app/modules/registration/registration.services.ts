import { Contact } from "../../entity/contact";
import registrationRepository from "../../repository/registrationRepository";
import verificationRepository from "../../repository/verificationRepository";
import { logger } from "../../utils/logger";
import { getJwtConfig } from "./config/jwtConfig";
import { TProfile } from "./interface/registration.interface";
import { GetRegistrationDTO } from "./registration.dto";
import bcrypt from "bcrypt";
import { createToken } from "./utils/registrationUtils";
import { TDocument } from "../document/interface/document.interface";
import documentRepository from "../../repository/documentRepository";
import { Profile } from "../../entity/profile";
import AppError from "../../errors/appError";

class RegistraionService{
    private updateContactVerificationStatus= async(id:string , contactData: Partial<Contact>)=>{
        await registrationRepository.updateContactById(id, contactData);
    }

    private updateDocument=async(id:string , documentData:Partial<TDocument>)=>{
        await documentRepository.updateDocument(id, documentData);
    }


    // create/register a profile
    createProfile= async(profileData:TProfile)=>{
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
    }


    // login a user
    loginUser= async( pin:string , profile:Profile)=>{

        const isPinMatch= await bcrypt.compare(pin, profile.pin);

        if(!isPinMatch){
            logger.error(`Pin doesnot match , please try again.`);
            throw new AppError(400, `Pin doesnot match , please try again.`);
        }

        const jwtPayload={
            profileId: profile.id,
            nickName: profile.nickName,
            mobileNumber: profile.contacts.find(contact=>contact.type==="PHONE")?.value,
        }

        const jwtConfig= await getJwtConfig();

        const acessToken=createToken(
            jwtPayload,
            jwtConfig.JWT_ACCESS_SECRET,
            jwtConfig.JWT_ACCESS_EXPIRES_IN
        )

        const refreshToken=createToken(
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
    }
}

export default new RegistraionService();