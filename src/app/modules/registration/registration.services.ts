import { Contact } from "../../entity/contact";
import registrationRepository from "../../repository/registrationRepository";
import verificationRepository from "../../repository/verificationRepository";
import { logger } from "../../utils/logger";
import { getJwtConfig } from "./config/jwtConfig";
import { TProfile } from "./interface/registration.interface";
import { GetProfileDTO, GetRegistrationDTO } from "./models/dto/dto.registration";
import bcrypt from "bcrypt";
import { TDocument } from "../document/interface/document.interface";
import documentRepository from "../../repository/documentRepository";
import { Profile } from "../../entity/profile";
import AppError from "../../errors/appError";
import { DocumentType } from "../document/enums/documentEnum";
import { contactType, proficiecy, profileStatus, ProfileType, roles, SocialMeida } from "./enums/registrationEnum";
import { getFullName } from "./utils/getFullName";
import { serviceLogging } from "../../utils/serviceLogging";
import { Events } from "../../kafka/events";
import { Producer } from "../../kafka/producer/producer";
import documentServices from "../document/services/document.services";
import { AsyncContextService, JwtService, Loggable, LoggerService, NotFoundError, Page, Pageable, UnauthorizedError } from "@neon-lab-dev/platform";
import { ProfileSpecification } from "./specification/profileSpecification";
import { ProfileSearchCriteria } from "./models/request/searchCriteria/profileSearchCriteria";
import { FetchProfileDtoBuilder } from "./models/builder/fetchProfileDtoBuilder";
import { FetchProfileDto } from "./models/dto/dto.fetch.profile";
import { UpdateProfileStatusRequest } from "./models/request/updateProfileStatusRequest";
import notificationServices from "../notification/services/notification.services";
import { Medium } from "../notification/enums/notificationEnum";
import bodyText from "../../providers/appNotification/bodyText";
import { FetchHiringRateRequest } from "./models/request/fetchHiringRateRequest";
import { HiringRateDto } from "./models/dto/dto.hiringRate";
import { HiringRateDtoBuilder } from "./models/builder/hiringRateDtoBuilder";
import { FetchProfileDetailsRequest } from "./models/request/fetchProfileDetailsRequest";
import { FetchProfileDetailsDtoBuilder } from "./models/builder/fetchProfileDetailsDtoBuilder";
import { FetchProfileDetailsResponseDto } from "./models/dto/dto.fetch.profile.details";
import { UpdateProfileRequest } from "./models/request/updateProfileRequest";
import { profileService } from "../profile/service.profile";
import { UpdateHiringRateRequest } from "./models/request/updateHiringRateRequest";
import { HiringRate } from "../../entity/hiringRate";
import { UpdatePinRequest } from "./models/request/updatePinRequest";
import { DeepPartial } from "typeorm";
import { Follows } from "../../entity/follows";
import { DeleteProfileRequest } from "./models/request/deleteProfileRequest";
import { getPublicIdFromUrl } from "../document/utils/getPublicIdFromCloudinaryUrl";
import cloudinaryServices from "../document/services/cloudinaryServices";
import censorSensitiveInfo from "../../utils/censorSensitiveInfo";
import servicePostProxy from "../../service/post-proxy/service.post-proxy";
import { Privacy } from "../../service/post-proxy/enum/privacyEnum";

class RegistrationService{



    private producer: Producer= new Producer()

    private updateContactVerificationStatus= async(id:string , contactData: Partial<Contact>)=>{
        await registrationRepository.updateContactById(id, contactData);
    }

    private updateDocument=async(id:string , documentData:Partial<TDocument>)=>{
        await documentRepository.updateDocument(id, documentData);
    }

    private async sendNotification(profile: Profile , nickName: string){
            await notificationServices.createNotification({
                medium: Medium.NOTIFICATION,
                to: profile.id,
                bodyText: JSON.stringify(bodyText.sendRegistrationRequest(nickName))
            })
    }

    private async checkExisting(id:string):Promise<Profile>{
        const profile= await registrationRepository.findProfileById(id);
        if(!profile || profile.status=== profileStatus.BLOCKED){
            throw new NotFoundError("profile not found");
        }
        return profile;
    }

    private async checkExistingHiringRate(id:string):Promise<void>{
        const hiringRate= await registrationRepository.findHiringRateById(id);
        if(!hiringRate){
            throw new NotFoundError("hiring rate does not exist");
        }
    }

    public async authorizeProfile(id:string){
        const profileId= AsyncContextService.getUserId();
        if(profileId!=id){
            throw new UnauthorizedError("unauthorized access");
        }
    }

    // create/register a profile
    createProfile= serviceLogging(
        "RegistrationService",
        "createProfile",
        async(profileData:TProfile)=>{
        const {firstName , lastName , groupName , nickName , pin , profileType ,role, contacts , address , portfolio , profileDocumentId}=profileData;

        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(pin, salt);

        const status= portfolio.proficiency== proficiecy.SKILLED ? profileStatus.APPROVED : profileStatus.PENDING;

        const bio= censorSensitiveInfo.censor(portfolio.bio as string);

        const newProfile= await registrationRepository.createProfile({
            firstName,
            lastName,
            groupName,
            nickName,
            pin:hashedPin,
            profileType , 
            status,
            role,   
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
                bio: bio || "",
                hiringRate: portfolio.hiringRate,
                follows: portfolio.follows?.map(
                    follow=>({
                        socialMedia: follow.socialMedia,
                        link: follow.link,
                        followers: follow.followers,
                        following: follow.following
                    })
                ) as DeepPartial<Follows[]>
            }
        })

        await servicePostProxy.createPrivacy({
            type: Privacy.PUBLIC,
            userReferenceId: newProfile.id
        })

        await Promise.all(contacts.map(async(contact)=>{
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

        await Promise.all(
            portfolio.videoDocumentIds.map(async(video)=>{
                await this.updateDocument(video, {
                    portfolioId: newProfile.portfolio.id
                })
            })
        )

        await Promise.all(
            portfolio.imageDocumentIds.map(async(image)=>{
                await this.updateDocument(image, {
                    portfolioId: newProfile.portfolio.id
                })
            })
        )


        if(portfolio.eventsDoneDocumentIds){
            await Promise.all(
                portfolio.eventsDoneDocumentIds.map(async(event)=>{
                    await this.updateDocument(event, {
                        portfolioId: newProfile.portfolio.id
                    })
                })
            )
        }

        const phoneNumber= newProfile.contacts.map((contact)=> {
            if(contact.type=== contactType.PHONE){
                return contact.value;
            }
        });

        const document= await documentServices.getDocument([profileDocumentId])

        const shortUser={
            referenceId: newProfile.id,
            nickName: newProfile.nickName,
            profilePictureUrl: document[0].url,
            phoneNo: phoneNumber[0]
        }

        // this.producer.produce(Events.CUSTOMER_CREATED , {shortUser})

        if(newProfile.portfolio.proficiency=== proficiecy.PROFESSIONAL){
            const admin= await registrationRepository.findByRole(roles.ADMIN);

            Promise.all(admin.map((admin)=> this.sendNotification(admin , newProfile.nickName)))
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
                portfolioId: profile.portfolio.id,
                nickName: profile.nickName,
                role: profile.role
            },
            accessToken: acessToken,
            refreshToken: refreshToken
        }
    })

    // get profile
    getShortProfile= serviceLogging(
        "RegistrationService",
        "getProfile",
        async(id:string)=>{
        const profile= await this.checkExisting(id);

        const fetchedProfile= new GetProfileDTO(profile).toJSON();

        const profilePhotoId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.PROFILE_PHOTO);

        const privacy= await servicePostProxy.fetchPrivacy({
            userReferenceId: profile.id
        });

        let following= null;

        const loggedInUserProfile = AsyncContextService.getUserId();

        if(profile.id!=loggedInUserProfile){
            const follow= await servicePostProxy.fetchFollow({
                followingId: profile.id
            })
            if(follow){
                following= true;
            }else{
                following=false;
            }
        }

        if(fetchedProfile.profileType===ProfileType.INDIVIDUAL){
            const name= getFullName(fetchedProfile.firstName as string, fetchedProfile.lastName as string);
            
                if(fetchedProfile.isSubscribed){
                    return {
                    name: name,
                    nickName: fetchedProfile.nickName,
                    portfolioId: fetchedProfile.portfolio.id,
                    bio: fetchedProfile.portfolio.bio || "",
                    follows: fetchedProfile.portfolio.follows,
                    isSubscribed:  fetchedProfile.isSubscribed,
                    profilePictureId: profilePhotoId,
                    online:fetchedProfile.online,
                    privacy: privacy?.type,
                    following: following,
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
                    follows: fetchedProfile.portfolio.follows,
                    isSubscribed:  fetchedProfile.isSubscribed,
                    profilePictureId: profilePhotoId,
                    following: following,
                    privacy: privacy?.type,
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
                        follows: fetchedProfile.portfolio.follows,
                        isSubscribed: fetchedProfile.isSubscribed,
                        following: following,
                        privacy: privacy?.type,  
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
                        following: following,
                        privacy: privacy?.type,
                        online:fetchedProfile.online,
                        bio: fetchedProfile.portfolio.bio || "",
                        follows: fetchedProfile.portfolio.follows,
                        isSubscribed: fetchedProfile.isSubscribed
                        },
                    profilePictureId: profilePhotoId
                    }
                }
        }
    })

    @Loggable()
    public async getProfileDetails(req: FetchProfileDetailsRequest):Promise<FetchProfileDetailsResponseDto>{
        const profile= await registrationRepository.findProfileById(req.id);

        if(!profile){
            throw new NotFoundError("profile not found");
        }

        return FetchProfileDetailsDtoBuilder.builder().of(profile).build();
    }

    // get profiles
    @Loggable()
    public async getProfiles (req: ProfileSearchCriteria): Promise<Page<FetchProfileDto>>{

        const spec= new ProfileSpecification(req);

        const entityPage= await registrationRepository.findPage(spec , req);

        const fetchedProfiles= FetchProfileDtoBuilder.builder().ofArray(entityPage.items);

        return Pageable.buildPage(fetchedProfiles, entityPage.total, req);
    }

    getProfileCount=serviceLogging(
        "RegistraionService",
        "getProfileCount",
        async()=>{
            return await registrationRepository.getProfileCount();
        }
    )

    @Loggable()
    public async updateProfileStatus(req: UpdateProfileStatusRequest):Promise<void>{
        await this.checkExisting(req.id);
        await registrationRepository.updateProfile(req.id , {status: req.status});
    }

    @Loggable()
    public async updateProfile(req:UpdateProfileRequest):Promise<void>{
        await this.checkExisting(req.id);
        await this.authorizeProfile(req.id);
        const loggedInUserProfile=await profileService.fetchWithPortfolio(req.id);
        await registrationRepository.updateProfile(req.id,{
            firstName: req.firstName,
            lastName: req.lastName
        })
        await registrationRepository.updatePortfolio(loggedInUserProfile.portfolio.id , {totalEvents:req.totalEvents});
    }

    @Loggable()
    public async fetchHiringRate(req: FetchHiringRateRequest): Promise<HiringRateDto>{
        const res= await registrationRepository.findHiringRate(req.portfolioId);

        if(!res){
            LoggerService.error("Hiring rate not found")
            throw new NotFoundError("Hiring reat not found")
        }

        return HiringRateDtoBuilder.Builder().of(res).build()
    }

    @Loggable()
    public async updateHiringRate(req: UpdateHiringRateRequest){
        await this.checkExistingHiringRate(req.id);
        const updatedData={
            hourlyPricing: req.hourlyPricing,
            dailyPricing: req.dailyPricing,
            weeklyPricing: req.weeklyPricing,
            monthlyPricing: req.monthlyPricing
        }
        return await registrationRepository.updateHiringRate(req.id , updatedData)
    }

    @Loggable()
    public async updatePin(req:UpdatePinRequest){
        const profile= await registrationRepository.findProfileByCredential(req.credential);
        if(!profile){
            throw new NotFoundError("profile not found")
        }
        await this.authorizeProfile(profile.id);
        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(req.pin, salt);
        await registrationRepository.updateProfile(profile.id , {pin: hashedPin});
    }

    @Loggable()
    public async delete(req: DeleteProfileRequest){
        await this.checkExisting(req.id);
        await this.authorizeProfile(req.id);
        const referenceId={
            referenceId: req.id
        }
        this.producer.produce(Events.CUSTOMER_DELETED , {referenceId})
        const loggedInUserProfile= await profileService.fetchWithPortfolio(req.id);
        const existingDocuments= await documentServices.fetchDocuments({
            portfolioId: loggedInUserProfile.portfolio.id
        })
        const publicIds= existingDocuments.map((doc)=> getPublicIdFromUrl(doc.url));
        await Promise.all(publicIds.map(async(id)=>{
            await cloudinaryServices.deleteFile(id as string);
        }))
        await registrationRepository.delete(req.id);
    }

    @Loggable()
    public async fetchPortfolio(id:string){
        const portfolio= await registrationRepository.findPortfolioById(id);

        if(portfolio){
            return portfolio;
        }
        throw new NotFoundError("portfolio not found")
    }

}

export default new RegistrationService();