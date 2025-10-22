"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registration_services_1 = __importDefault(require("./registration.services"));
const registrationRepository_1 = __importDefault(require("../../repository/registrationRepository"));
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const documentRepository_1 = __importDefault(require("../../repository/documentRepository"));
const documentEnum_1 = require("../document/enums/documentEnum");
const proxyLogging_1 = require("../../utils/proxyLogging");
class RegistrationProxy {
    constructor() {
        this.checkExistingDocument = async (documentId, documentType) => {
            const existingDocument = await documentRepository_1.default.findByIdAndType(documentId, documentType);
            if (!existingDocument) {
                logger_1.logger.error(`${documentType} with this Id doesnot exist`);
                throw new appError_1.default(404, `${documentType} doesnot exist`);
            }
        };
        this.createProfile = (0, proxyLogging_1.proxyLogging)("RegistrationProxy", "createProfile", async (profileData) => {
            const { nickName, contacts, profileDocumentId, portfolio } = profileData;
            const existingProfile = await registrationRepository_1.default.findProfileByCredential(nickName);
            if (existingProfile) {
                logger_1.logger.error("Profile with this nickname already exists");
                throw new appError_1.default(409, "Profile with this nickname already exists");
            }
            const existingProfileByContact = await Promise.all(contacts.map(async (contact) => {
                return await registrationRepository_1.default.findProfileByContactValue(contact.value);
            }));
            if (existingProfileByContact.some(profile => profile !== null)) {
                logger_1.logger.error("Profile with these contacts value already exists");
                throw new appError_1.default(409, `Profile with these contacts already exists`);
            }
            await this.checkExistingDocument(profileDocumentId, documentEnum_1.DocumentType.PROFILE_PHOTO);
            await this.checkExistingDocument(portfolio.videoDocumentId, documentEnum_1.DocumentType.VIDEO);
            await this.checkExistingDocument(portfolio.imageDocumentId, documentEnum_1.DocumentType.IMAGE);
            if (portfolio.eventsDoneDocumentId) {
                await this.checkExistingDocument(portfolio.eventsDoneDocumentId, documentEnum_1.DocumentType.EVENT);
            }
            return await registration_services_1.default.createProfile(profileData);
        });
        this.loginUser = (0, proxyLogging_1.proxyLogging)("RegistrationProxy", "loginUser", async (credential, pin) => {
            const profile = await registrationRepository_1.default.findProfileByCredential(credential);
            if (!profile) {
                logger_1.logger.error(`  Profile doesnot exist.`);
                throw new appError_1.default(404, `Profile doesnot exist.`);
            }
            return await registration_services_1.default.loginUser(pin, profile);
        });
        // get profile
        this.getProfile = (0, proxyLogging_1.proxyLogging)("RegistrationProxy", "getProfile", async (id) => {
            return await registration_services_1.default.getProfile(id);
        });
        // get profiles
        this.getProfiles = (0, proxyLogging_1.proxyLogging)("RegistrationProxy", "getProfiles", async (page, limit) => {
            return await registration_services_1.default.getProfiles(page, limit);
        });
    }
}
exports.default = new RegistrationProxy();
