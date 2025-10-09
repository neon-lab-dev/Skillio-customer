"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registration_services_1 = __importDefault(require("./registration.services"));
const registrationRepository_1 = __importDefault(require("../../repository/registrationRepository"));
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
class RegistrationProxy {
    constructor() {
        this.createProfile = async (profileData) => {
            const { nickName, contacts } = profileData;
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
            return await registration_services_1.default.createProfile(profileData);
        };
        this.loginUser = async (credential, pin) => {
            const profile = await registrationRepository_1.default.findProfileByCredential(credential);
            if (!profile) {
                logger_1.logger.error(`Profile doesnot exist.`);
                throw new appError_1.default(404, `Profile doesnot exist.`);
            }
            return await registration_services_1.default.loginUser(pin, profile);
        };
    }
}
exports.default = new RegistrationProxy();
