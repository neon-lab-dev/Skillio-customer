"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrationRepository_1 = __importDefault(require("../../repository/registrationRepository"));
const verificationRepository_1 = __importDefault(require("../../repository/verificationRepository"));
const logger_1 = require("../../utils/logger");
const jwtConfig_1 = require("./config/jwtConfig");
const registration_dto_1 = require("./registration.dto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registrationUtils_1 = require("./utils/registrationUtils");
const documentRepository_1 = __importDefault(require("../../repository/documentRepository"));
const appError_1 = __importDefault(require("../../errors/appError"));
const documentEnum_1 = require("../document/enums/documentEnum");
const registrationEnum_1 = require("./enums/registrationEnum");
const getFullName_1 = require("./utils/getFullName");
const serviceLogging_1 = require("../../utils/serviceLogging");
const events_1 = require("../../kafka/events");
const document_services_1 = __importDefault(require("../document/services/document.services"));
const producer_1 = require("../../kafka/producer/producer");
class RegistraionService {
    constructor() {
        this.updateContactVerificationStatus = async (id, contactData) => {
            await registrationRepository_1.default.updateContactById(id, contactData);
        };
        this.updateDocument = async (id, documentData) => {
            await documentRepository_1.default.updateDocument(id, documentData);
        };
        this.producer = new producer_1.Producer();
        // create/register a profile
        this.createProfile = (0, serviceLogging_1.serviceLogging)("RegistrationService", "createProfile", async (profileData) => {
            const { firstName, lastName, groupName, nickName, pin, profileType, contacts, address, portfolio, profileDocumentId } = profileData;
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPin = await bcrypt_1.default.hash(pin, salt);
            const newProfile = await registrationRepository_1.default.createProfile({
                firstName,
                lastName,
                groupName,
                nickName,
                pin: hashedPin,
                profileType,
                contacts: contacts.map(contact => ({
                    type: contact.type,
                    value: contact.value,
                    primary: contact.primary,
                })),
                address: {
                    streetAddress: address.streetAddress,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    pinCode: address.pinCode,
                    location: address.location
                },
                portfolio: {
                    category: portfolio.category,
                    subCategory: portfolio.subCategory,
                    proficiency: portfolio.proficiency,
                    totalEvents: portfolio.totalEvents,
                    bio: portfolio.bio || ""
                }
            });
            Promise.all(contacts.map(async (contact) => {
                const verification = await verificationRepository_1.default.findOneById(contact.verificationId);
                const existingContact = await registrationRepository_1.default.findContactByValue(contact.value);
                if (verification?.otpCodeStatus === "VERIFIED") {
                    await this.updateContactVerificationStatus(existingContact.id, {
                        isVerified: true
                    });
                }
                else {
                    await this.updateContactVerificationStatus(existingContact.id, {
                        isVerified: false
                    });
                }
            }));
            await this.updateDocument(profileDocumentId, {
                portfolioId: newProfile.portfolio.id
            });
            await this.updateDocument(portfolio.videoDocumentId, {
                portfolioId: newProfile.portfolio.id
            });
            await this.updateDocument(portfolio.imageDocumentId, {
                portfolioId: newProfile.portfolio.id
            });
            if (portfolio.eventsDoneDocumentId) {
                await this.updateDocument(portfolio.eventsDoneDocumentId, {
                    portfolioId: newProfile.portfolio.id
                });
            }
            const document = await document_services_1.default.getDocument(profileDocumentId);
            const shortUser = {
                referenceId: newProfile.id,
                nickName: newProfile.nickName,
                profilePictureUrl: document.document.url
            };
            this.producer.produce(events_1.Events.CUSTOMER_CREATED, { shortUser });
            const profile = new registration_dto_1.GetRegistrationDTO(newProfile).toJSON();
            return profile;
        });
        // login a user
        this.loginUser = (0, serviceLogging_1.serviceLogging)("RegistrationService", "loginUser", async (pin, profile) => {
            const isPinMatch = await bcrypt_1.default.compare(pin, profile.pin);
            if (!isPinMatch) {
                logger_1.logger.error(`Pin doesnot match , please try again.`);
                throw new appError_1.default(400, `Pin doesnot match , please try again.`);
            }
            const jwtPayload = {
                profileId: profile.id,
                nickName: profile.nickName,
                mobileNumber: profile.contacts.find(contact => contact.type === "PHONE")?.value,
            };
            const jwtConfig = await (0, jwtConfig_1.getJwtConfig)();
            const acessToken = (0, registrationUtils_1.createToken)(jwtPayload, jwtConfig.JWT_ACCESS_SECRET, jwtConfig.JWT_ACCESS_EXPIRES_IN);
            const refreshToken = (0, registrationUtils_1.createToken)(jwtPayload, jwtConfig.JWT_REFRESH_SECRET, jwtConfig.JWT_REFRESH_EXPIRES_IN);
            return {
                profile: {
                    id: profile.id,
                    nickName: profile.nickName
                },
                accessToken: acessToken,
                refreshToken: refreshToken
            };
        });
        // get profile
        this.getProfile = (0, serviceLogging_1.serviceLogging)("RegistrationService", "getProfile", async (id) => {
            const profile = await registrationRepository_1.default.findProfileById(id);
            if (!profile) {
                logger_1.logger.error("Profile with this Id doesnot exist");
                throw new appError_1.default(404, "Profile does not exist");
            }
            const fetchedProfile = new registration_dto_1.GetProfileDTO(profile).toJSON();
            const profilePhotoId = await documentRepository_1.default.findDocumentIdByPortfolioIdAndType(fetchedProfile.portfolio.id, documentEnum_1.DocumentType.PROFILE_PHOTO);
            if (fetchedProfile.profileType === registrationEnum_1.ProfileType.INDIVIDUAL) {
                const name = (0, getFullName_1.getFullName)(fetchedProfile.firstName, fetchedProfile.lastName);
                if (fetchedProfile.isSubscribed) {
                    return {
                        name: name,
                        nickName: fetchedProfile.nickName,
                        portfolioId: fetchedProfile.portfolio.id,
                        bio: fetchedProfile.portfolio.bio || "",
                        isSubscribed: fetchedProfile.isSubscribed,
                        profilePictureId: profilePhotoId,
                        online: fetchedProfile.online,
                        propritaryDetails: {
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            phoneNumber: profile.contacts.find(contact => contact.type === "PHONE")?.value,
                            email: profile.contacts.find(contact => contact.type === "EMAIL")?.value,
                        }
                    };
                }
                else {
                    return {
                        name: name,
                        nickName: fetchedProfile.nickName,
                        portfolioId: fetchedProfile.portfolio.id,
                        bio: fetchedProfile.portfolio.bio || "",
                        isSubscribed: fetchedProfile.isSubscribed,
                        profilePictureId: profilePhotoId,
                        online: fetchedProfile.online,
                    };
                }
            }
            else {
                if (fetchedProfile.isSubscribed) {
                    return {
                        profile: {
                            groupName: fetchedProfile.groupName,
                            nickName: fetchedProfile.nickName,
                            portfolioId: fetchedProfile.portfolio.id,
                            bio: fetchedProfile.portfolio.bio || "",
                            isSubscribed: fetchedProfile.isSubscribed,
                            online: fetchedProfile.online,
                        },
                        profilePictureId: profilePhotoId,
                        propritaryDetails: {
                            groupName: profile.groupName,
                            phoneNumber: profile.contacts.find(contact => contact.type === "PHONE")?.value,
                            email: profile.contacts.find(contact => contact.type === "EMAIL")?.value,
                        }
                    };
                }
                else {
                    return {
                        profile: {
                            groupName: fetchedProfile.groupName,
                            nickName: fetchedProfile.nickName,
                            portfolioId: fetchedProfile.portfolio.id,
                            online: fetchedProfile.online,
                            bio: fetchedProfile.portfolio.bio || "",
                            isSubscribed: fetchedProfile.isSubscribed
                        },
                        profilePictureId: profilePhotoId
                    };
                }
            }
        });
        // get profiles
        this.getProfiles = (0, serviceLogging_1.serviceLogging)("RegistrationService", "getProfiles", async (page, limit) => {
            const profiles = await registrationRepository_1.default.findAllProfiles(page, limit);
            const fetchedProfiles = profiles.map(profile => new registration_dto_1.GetProfileDTO(profile).toJSON());
            const shortProfiles = Promise.all(fetchedProfiles.map(async (profile) => {
                if (profile.profileType === registrationEnum_1.ProfileType.INDIVIDUAL) {
                    const name = (0, getFullName_1.getFullName)(profile.firstName, profile.lastName);
                    const profilePhotoId = await documentRepository_1.default.findDocumentIdByPortfolioIdAndType(profile.portfolio.id, documentEnum_1.DocumentType.PROFILE_PHOTO);
                    return {
                        name: name,
                        nickName: profile.nickName,
                        profilePcitureId: profilePhotoId,
                    };
                }
                else {
                    const profilePhotoId = await documentRepository_1.default.findDocumentIdByPortfolioIdAndType(profile.portfolio.id, documentEnum_1.DocumentType.PROFILE_PHOTO);
                    return {
                        groupName: profile.groupName,
                        nickName: profile.nickName,
                        profilePcitureId: profilePhotoId,
                    };
                }
            }));
            return shortProfiles;
        });
    }
}
exports.default = new RegistraionService();
