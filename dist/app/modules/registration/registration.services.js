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
class RegistraionService {
    constructor() {
        this.updateContactVerificationStatus = async (id, contactData) => {
            await registrationRepository_1.default.updateContactById(id, contactData);
        };
        this.updateDocument = async (id, documentData) => {
            await documentRepository_1.default.updateDocument(id, documentData);
        };
        // create/register a profile
        this.createProfile = async (profileData) => {
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
                profileId: newProfile.id
            });
            await this.updateDocument(portfolio.videoDocumentId, {
                portfolioVideoId: newProfile.portfolio.id
            });
            await this.updateDocument(portfolio.imageDocumentId, {
                portfolioImageId: newProfile.portfolio.id
            });
            if (portfolio.eventsDoneDocumentId) {
                await this.updateDocument(portfolio.eventsDoneDocumentId, {
                    portfolioEventsDoneId: newProfile.portfolio.id
                });
            }
            const profile = new registration_dto_1.GetRegistrationDTO(newProfile).toJSON();
            return profile;
        };
        // login a user
        this.loginUser = async (pin, profile) => {
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
        };
    }
}
exports.default = new RegistraionService();
