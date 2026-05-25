import { Contact } from "../../entity/contact";
import registrationRepository from "../../repository/registrationRepository";
import verificationRepository from "../../repository/verificationRepository";
import { logger } from "../../utils/logger";
import { getJwtConfig } from "./config/jwtConfig";
import { TContact, TProfile } from "./interface/registration.interface";
import { GetProfileDTO, GetRegistrationDTO } from "./models/dto/dto.registration";
import bcrypt from "bcrypt";
import { TDocument } from "../document/interface/document.interface";
import documentRepository from "../../repository/documentRepository";
import { Profile } from "../../entity/profile";
import AppError from "../../errors/appError";
import { DocumentType } from "../document/enums/documentEnum";
import { contactType, proficiecy, profileStatus, ProfileType, roles } from "./enums/registrationEnum";
import { getFullName } from "./utils/getFullName";
import { serviceLogging } from "../../utils/serviceLogging";
import { Events } from "../../kafka/events";
import { Producer } from "../../kafka/producer/producer";
import documentServices from "../document/services/document.services";
import { AppValidationError, AsyncContextService, ERROR_CODES, JwtService, Loggable, LoggerService, NotFoundError, Page, Pageable, UnauthorizedError } from "@neon-lab-dev/platform";
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
import { UpdatePinRequest } from "./models/request/updatePinRequest";
import { DeepPartial } from "typeorm";
import { Follows } from "../../entity/follows";
import { DeleteProfileRequest } from "./models/request/deleteProfileRequest";
import { getPublicIdFromUrl } from "../document/utils/getPublicIdFromCloudinaryUrl";
import cloudinaryServices from "../document/services/cloudinaryServices";
import censorSensitiveInfo from "../../utils/censorSensitiveInfo";
import servicePostProxy from "../../service/post-proxy/service.post-proxy";
import { Privacy } from "../../service/post-proxy/enum/privacyEnum";
import { ForgotPinRequest } from "./models/request/forgotPinRequest";
import { CheckIfPinSetRequest } from "./models/request/checkIfPinSetRequest";
import { CreateProfileDetailsRequest } from "./models/request/createProfileDetailsRequest";
import { ProfileDetails } from "../../entity/profileDetails";
import { ProfileDetailsEntityBuilder } from "./models/builder/profileDetailsEntityBuilder";
import { ProfileDetailsRepository } from "../../repository/profileDetailsRepository";
import addressService from "./modules/address/addressService";

class RegistrationService{


    private profileDetailsRepository= new ProfileDetailsRepository();

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

    public async checkExisting(id:string):Promise<Profile>{
        const profile= await registrationRepository.findProfileById(id);
        if(!profile || profile.profileDetails?.status=== profileStatus.BLOCKED){
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

    @Loggable()
    public async findProfileByCredential(credential: string):Promise<Profile | null>{
        const profile=await registrationRepository.findProfileByCredential(credential);
        return profile;
    }

    @Loggable()
    public async authorizeProfile(id:string){
        const profileId= AsyncContextService.getUserId();
        if(profileId!=id){
            throw new UnauthorizedError("unauthorized access");
        }
    }

    registerProfile= serviceLogging(
        "RegistrationService",
        "createProfile",
        async(profileData:TProfile)=>{
        const {profileDetails ,contacts , portfolio , profileDocumentId}=profileData;
        const status= portfolio.proficiency== proficiecy.SKILLED ? profileStatus.APPROVED : profileStatus.PENDING;

        const bio= censorSensitiveInfo.censor(portfolio.bio as string);

        const profileId= AsyncContextService.getUserId() as string;

        const exsitingProfileDetails= await registrationRepository.findProfileDetailsByProfileId(profileId);

        let newProfile;

        if(exsitingProfileDetails){
             newProfile= await registrationRepository.registerProfile({
                id: profileId,
                profileDetails:{
                firstName: profileDetails.firstName,
                lastName: profileDetails.lastName,
                groupName: profileDetails.groupName,
                nickName: profileDetails.nickName,
                profileType: profileDetails.profileType,
                status: status
                },
                portfolio:{
                category:portfolio.category,
                subCategory: portfolio.subCategory,
                proficiency: portfolio.proficiency,
                totalEvents: portfolio.totalEvents,
                bio: bio || "",
                hiringRate: {
                    hourlyPricing: portfolio.hiringRate.hourlyPricing,
                    dailyPricing: portfolio.hiringRate.dailyPricing,
                    weeklyPricing: portfolio.hiringRate.weeklyPricing,
                    monthlyPricing: portfolio.hiringRate.monthlyPricing
                },
                follows: portfolio.follows?.map(
                        follow=>({
                            socialMedia: follow.socialMedia,
                            link: follow.link,
                            followers: follow.followers,
                            following: follow.following
                        })
                    ) as DeepPartial<Follows[]>
                },
                contacts: contacts.map(contact=>({
                    type:contact.type,
                    value:contact.value,
                    primary:contact.primary,
                })),
                isCreator: true,
                isOnboarded: true
            })

            await Promise.all(profileDetails.address.map( async addr=>{
                await addressService.updateByProfileId(profileId , addr)
            }))
        }else{
            newProfile= await registrationRepository.registerProfile({
                id: profileId,
                profileDetails:{
                firstName: profileDetails.firstName,
                lastName: profileDetails.lastName,
                groupName: profileDetails.groupName,
                nickName: profileDetails.nickName,
                profileType: profileDetails.profileType,
                status: status
                },
                portfolio:{
                category:portfolio.category,
                subCategory: portfolio.subCategory,
                proficiency: portfolio.proficiency,
                totalEvents: portfolio.totalEvents,
                bio: bio || "",
                hiringRate: {
                    hourlyPricing: portfolio.hiringRate.hourlyPricing,
                    dailyPricing: portfolio.hiringRate.dailyPricing,
                    weeklyPricing: portfolio.hiringRate.weeklyPricing,
                    monthlyPricing: portfolio.hiringRate.monthlyPricing
                },
                follows: portfolio.follows?.map(
                        follow=>({
                            socialMedia: follow.socialMedia,
                            link: follow.link,
                            followers: follow.followers,
                            following: follow.following
                        })
                    ) as DeepPartial<Follows[]>
                },
                address: profileDetails.address.map(val=>({
                streetAddress: val.streetAddress,
                type: val.type,
                city: val.city,
                state: val.state,
                country: val.country,
                pinCode: val.pinCode,
                location: val.location
                })),
                contacts: contacts.map(contact=>({
                    type:contact.type,
                    value:contact.value,
                    primary:contact.primary,
                })),
                isCreator: true,
                isOnboarded: true
            })
            
            await servicePostProxy.createPrivacy({
                type: Privacy.PUBLIC,
                userReferenceId: profileId
            })

            
            const existingProfile= await this.checkExisting(profileId);

            const phoneNumber= existingProfile.contacts.map((contact)=> {
                if(contact.type=== contactType.PHONE){
                    return contact.value;
                }
            });

            const document= await documentServices.getDocument([profileDocumentId]);

            const fullName= profileDetails.firstName&& profileDetails.lastName&& getFullName(profileDetails.firstName as string, profileDetails.lastName as string);

            const name= fullName || profileDetails.groupName;
        

            const shortUser={
                referenceId: profileId,
                nickName: newProfile.profileDetails?.nickName,
                name: name,
                profilePictureUrl: document[0].url,
                phoneNo: phoneNumber[0],
                category: newProfile.portfolio?.category,
                subCategory: newProfile.portfolio?.subCategory,
                profileType: newProfile.profileDetails?.profileType
            }

            this.producer.produce(Events.CUSTOMER_CREATED , {shortUser})
            this.producer.produce(Events.PAYMENT_CUSTOMER_CREATED , {shortUser});
        }



        await this.updateDocument(profileDocumentId , {
            portfolioId: newProfile.portfolio?.id
        })

        await Promise.all(
            portfolio.videoDocumentIds.map(async(video)=>{
                await this.updateDocument(video, {
                    portfolioId: newProfile.portfolio?.id
                })
            })
        )

        await Promise.all(
            portfolio.imageDocumentIds.map(async(image)=>{
                await this.updateDocument(image, {
                    portfolioId: newProfile.portfolio?.id
                })
            })
        )


        if(portfolio.eventsDoneDocumentIds){
            await Promise.all(
                portfolio.eventsDoneDocumentIds.map(async(event)=>{
                    await this.updateDocument(event, {
                        portfolioId: newProfile.portfolio?.id
                    })
                })
            )
        }


        if(newProfile.portfolio?.proficiency=== proficiecy.PROFESSIONAL){
            const admin= await registrationRepository.findByRole(roles.ADMIN);

            Promise.all(admin.map((admin)=> this.sendNotification(admin , newProfile.profileDetails?.nickName!)))
        }

    const data = {
    profileDetails: {
        firstName:   newProfile.profileDetails?.firstName,
        lastName:    newProfile.profileDetails?.lastName,
        groupName:   newProfile.profileDetails?.groupName,
        nickName:    newProfile.profileDetails?.nickName!,   
        status:      newProfile.profileDetails?.status!,
        profileType: newProfile.profileDetails?.profileType!,
    },
    address: newProfile.address!.map(val => ({
        streetAddress: val?.streetAddress!,
        type: val?.type!,
        city:          val?.city!,
        country:       val?.country!,
        state:         val?.state!,
        pinCode:       val?.pinCode!,
        location:      val?.location!,
    })),
    contacts: newProfile.contacts.map(val => ({
        type: val.type,
        value: val.value,
        primary: val.primary,
        isVerified: val.isVerified
    })),
    portfolio: {
        category:    newProfile.portfolio?.category!,
        subCategory: newProfile.portfolio?.subCategory!,
        proficiency: newProfile.portfolio?.proficiency!,
        totalEvents: newProfile.portfolio?.totalEvents,
        bio:         newProfile.portfolio?.bio,
        hiringRate:  newProfile.portfolio?.hiringRate!,
        follows:     newProfile.portfolio?.follows ?? [],
    }
    }
        const profile= new GetRegistrationDTO(data).toJSON();

        return profile;
    })

    @Loggable()
    public async createProfile(contacts: TContact[]):Promise<Profile>{

        const existingProfileByContact= await Promise.all(contacts.map(async(contact)=>{
                return await registrationRepository.findProfileByContactValue(contact.value)
        }));
        
        if(existingProfileByContact.some(profile=>profile!==null)){
            LoggerService.error("Profile with these contacts value already exists");
            throw new AppError(409, `Profile with these contacts already exists`);
        }

        const profile= await registrationRepository.createProfile({
            role: roles.USER,
            contacts: contacts.map(contact=>({
                type:contact.type,
                value:contact.value,
                primary:contact.primary,
            }))
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

        return profile;

    }

    @Loggable()
    public async createProfileDetails(req: CreateProfileDetailsRequest): Promise<ProfileDetails>{
        
        const existingProfile= await registrationRepository.findProfileByCredential(req.nickName);
        
        if(existingProfile){
            LoggerService.error("Profile with this nickname already exists");
            throw new AppValidationError( "Profile with this nickname already exists" , ERROR_CODES.CONFLICT);
        }
        
        const entity=  (await ProfileDetailsEntityBuilder.builder().of(req)).build();

        const res= await this.profileDetailsRepository.create(entity);

        await Promise.all(req.address.map(
            async val=>{
               await addressService.create(val , req.profileId)
            }
        ))

        await servicePostProxy.createPrivacy({
            type: Privacy.PUBLIC,
            userReferenceId: res.profileId
        })

        const fullName= res.firstName&& res.lastName&& getFullName(res.firstName as string, res.lastName as string);

        const profile= await this.checkExisting(res.profileId);

        const phoneNumber= profile.contacts.map((contact)=> {
            if(contact.type=== contactType.PHONE){
                return contact.value;
            }
        });
        
        const shortUser={
            referenceId: res.profileId,
            nickName: res.nickName,
            ProfileType: res.profileType,
            name: fullName,
            phoneNo: phoneNumber[0]
        }

        this.producer.produce(Events.PAYMENT_CUSTOMER_CREATED , {shortUser});

        return res;
    }


    // login a user
    loginUser= serviceLogging(
        "RegistrationService",
        "loginUser",
        async( pin:string , profile:Profile)=>{

        const isPinMatch= await bcrypt.compare(pin, profile?.pin!);

        if(!isPinMatch){
            logger.error(`Pin doesnot match , please try again.`);
            throw new AppError(400, `Pin doesnot match , please try again.`);
        }

        const jwtPayload={
            profileId: profile.id,
            role: profile.role
        }

        const jwtConfig= await getJwtConfig();

        const accessToken=JwtService.createToken(
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
                portfolioId: profile.portfolio?.id,
                isOnboarded: profile.isOnboarded,
                isCreator: profile.isCreator,
                nickName: profile.profileDetails?.nickName,
                role: profile.role
            },
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    })

    // get profile
    getShortProfile= serviceLogging(
        "RegistrationService",
        "getProfile",
        async(id:string)=>{
        const profile= await this.checkExisting(id);

        const data={
            profileDetails: {...profile.profileDetails!},
            portfolio:{...profile.portfolio!},
            contacts: {...profile.contacts!},
            isSubscribed: profile.isSubscribed,
            online:{
                ...profile.online!
            }
        }

        const fetchedProfile= new GetProfileDTO(data).toJSON();

        const profilePhotoId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.PROFILE_PHOTO);
        const eventDoneDocumentId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.EVENT);
        const videoDocumentId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.VIDEO);
        const imageDocumentId= await documentRepository.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id , DocumentType.IMAGE);

        const privacy= await servicePostProxy.fetchPrivacy({
            userReferenceId: profile.id
        });

        let isFollowing= null;

        const loggedInUserProfile = AsyncContextService.getUserId();

        if(profile.id!=loggedInUserProfile){
            const follow= await servicePostProxy.fetchFollow({
                followingId: profile.id
            })
            if(follow){
                isFollowing= true;
            }else{
                isFollowing=false;
            }
        }

        const followCount= await servicePostProxy.fetchUserReach({userReferenceId: profile.id});

        if(fetchedProfile.profileDetails?.profileType===ProfileType.INDIVIDUAL || fetchedProfile.profileDetails?.profileType===ProfileType.HIRER){
            const name= getFullName(fetchedProfile.profileDetails?.firstName as string, fetchedProfile.profileDetails?.lastName as string);
            
                if(fetchedProfile.isSubscribed){
                    return {
                    name: name,
                    nickName: fetchedProfile.profileDetails.nickName,
                    profileType: fetchedProfile.profileDetails.profileType,
                    portfolioId: fetchedProfile.portfolio.id,
                    bio: fetchedProfile.portfolio.bio || "",
                    follows: fetchedProfile.portfolio.follows,
                    isSubscribed:  fetchedProfile.isSubscribed,
                    followCount: followCount,
                    profilePictureId: profilePhotoId.map((pid)=>pid.id),
                    eventDoneDocumentId: eventDoneDocumentId.map((eid)=>eid.id),
                    imageDocumentId: imageDocumentId.map(imId=> imId.id),
                    videoDocumentId: videoDocumentId.map(vid=>vid.id),
                    online:fetchedProfile.online,
                    category: fetchedProfile.portfolio.category,
                    subCategory: fetchedProfile.portfolio.subCategory,
                    privacy: privacy?.type,
                    isFollowing: isFollowing,
                    propritaryDetails:{
                        firstName: fetchedProfile.profileDetails.firstName,
                        lastName: fetchedProfile.profileDetails.lastName,
                        phoneNumber: profile.contacts.find(contact=>contact.type==="PHONE")?.value,
                        email: profile.contacts.find(contact=>contact.type==="EMAIL")?.value,
                        } 
                    }
                }else{
                    return{
                    name: name,
                    nickName: fetchedProfile.profileDetails.nickName,
                    profileType: fetchedProfile.profileDetails.profileType,
                    portfolioId: fetchedProfile.portfolio.id,
                    bio: fetchedProfile.portfolio.bio || "",
                    follows: fetchedProfile.portfolio.follows,
                    isSubscribed:  fetchedProfile.isSubscribed,
                    followCount: followCount,
                    profilePictureId: profilePhotoId.map((pid)=>pid.id),
                    eventDoneDocumentId: eventDoneDocumentId.map((eid)=>eid.id),
                    imageDocumentId: imageDocumentId.map(imId=> imId.id),
                    videoDocumentId: videoDocumentId.map(vid=>vid.id),
                    isFollowing: isFollowing,
                    category: fetchedProfile.portfolio.category,
                    subCategory: fetchedProfile.portfolio.subCategory,
                    privacy: privacy?.type,
                    online:fetchedProfile.online,
                    }
                }
            }
        else{
                if(fetchedProfile.isSubscribed){
                    return{
                    profile:{
                        groupName: fetchedProfile.profileDetails.groupName,
                        nickName: fetchedProfile.profileDetails.nickName,
                        profileType: fetchedProfile.profileDetails.profileType,
                        portfolioId: fetchedProfile.portfolio.id,
                        bio: fetchedProfile.portfolio.bio || "",
                        follows: fetchedProfile.portfolio.follows,
                        isSubscribed: fetchedProfile.isSubscribed,
                        followCount: followCount,
                        isFollowing: isFollowing,
                        category: fetchedProfile.portfolio.category,
                        subCategory: fetchedProfile.portfolio.subCategory,
                        privacy: privacy?.type,  
                        online:fetchedProfile.online,
                    },
                    profilePictureId: profilePhotoId.map((pid)=>pid.id),
                    eventDoneDocumentId: eventDoneDocumentId.map((eid)=>eid.id),
                    imageDocumentId: imageDocumentId.map(imId=> imId.id),
                    videoDocumentId: videoDocumentId.map(vid=>vid.id),
                    propritaryDetails:{
                        groupName: fetchedProfile.profileDetails.groupName,
                        phoneNumber: profile.contacts.find(contact=>contact.type==="PHONE")?.value,
                        email: profile.contacts.find(contact=>contact.type==="EMAIL")?.value,
                        }
                    }
                }else{
                    return{
                    profile:{
                        groupName: fetchedProfile.profileDetails.groupName,
                        nickName: fetchedProfile.profileDetails.nickName,
                        portfolioId: fetchedProfile.portfolio.id,
                        profileType: fetchedProfile.profileDetails.profileType,
                        followCount: followCount,
                        isFollowing: isFollowing,
                        privacy: privacy?.type,
                        online:fetchedProfile.online,
                        category: fetchedProfile.portfolio.category,
                        subCategory: fetchedProfile.portfolio.subCategory,
                        bio: fetchedProfile.portfolio.bio || "",
                        follows: fetchedProfile.portfolio.follows,
                        isSubscribed: fetchedProfile.isSubscribed
                        },
                    profilePictureId: profilePhotoId.map((pid)=>pid.id),
                    eventDoneDocumentId: eventDoneDocumentId.map((eid)=>eid.id),
                    imageDocumentId: imageDocumentId.map(imId=> imId.id),
                    videoDocumentId: videoDocumentId.map(vid=>vid.id),
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

        const fetchedProfiles= await FetchProfileDtoBuilder.builder().ofArray(entityPage.items);

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
        await registrationRepository.updateProfileDetailsByProfileId(req.id , {status: req.status});
    }

    @Loggable()
    public async updateProfile(req:UpdateProfileRequest):Promise<void>{
        await this.checkExisting(req.id);
        await this.authorizeProfile(req.id);
        const loggedInUserProfile=await profileService.fetchWithPortfolio(req.id);
        await registrationRepository.updateProfileDetailsByProfileId(req.id,{
            firstName: req.firstName,
            lastName: req.lastName
        })

        const name= getFullName(req.firstName as string, req.lastName as string);

        const updatedData={
            referenceId: loggedInUserProfile.id,
            name: name
        }

        this.producer.produce(Events.CUSTOMER_UPDATED , {updatedData});

        await registrationRepository.updatePortfolio(loggedInUserProfile.portfolio!.id , {totalEvents:req.totalEvents});
    }

    @Loggable()
    public async fetchHiringRate(req: FetchHiringRateRequest): Promise<HiringRateDto>{
        const res= await registrationRepository.findHiringRate(req.portfolioId);

        if(!res){
            LoggerService.error("Hiring rate not found")
            throw new NotFoundError("Hiring rate not found")
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
        const profile= await this.findProfileByCredential(req.credential);
        if(!profile){
            throw new NotFoundError("profile does not exist , please register first.")
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
            portfolioId: loggedInUserProfile.portfolio!.id
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

    @Loggable()
    public async forgotPin(req: ForgotPinRequest):Promise<void>{
        const profile= await this.findProfileByCredential(req.credential);
        if(!profile){
            throw new NotFoundError("profile does not exist , please register first.")
        }
        if(req.confirmPin!== req.pin){
            throw new AppValidationError("Entered pin's does not match" , ERROR_CODES.VALIDATION_ERROR);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(req.pin, salt);
        await registrationRepository.updateProfile(profile.id , {pin: hashedPin});
    }

    @Loggable()
    public async checkIfPinSet(req:CheckIfPinSetRequest){
        const profile= await this.findProfileByCredential(req.credential);
        if(!profile || !profile?.pin){
            return {
                ifPinSet: false
            };
        }
        return {
            isPinSet: true
        };
    }

}

export default new RegistrationService();