"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const registrationEnum_1 = require("../modules/registration/enums/registrationEnum");
class RegistrationRepository {
    constructor() {
        // create/register a profile
        this.createProfile = async (profileData) => {
            const newProfile = this.profileRepository.create(profileData);
            return await this.profileRepository.save(newProfile);
        };
        // update a profile
        this.updateProfile = async (id, profileData) => {
            return await this.profileRepository.update(id, profileData);
        };
        // findProfileByContactValue
        this.findProfileByCredential = async (credential) => {
            return await this.profileRepository
                .createQueryBuilder("profile")
                .leftJoinAndSelect("profile.contacts", "contact")
                .where("profile.nickName = :credential", { credential })
                .orWhere("contact.value = :credential AND contact.type IN (:...types)", {
                credential,
                types: [registrationEnum_1.contactType.PHONE, registrationEnum_1.contactType.EMAIL]
            })
                .getOne();
        };
        this.findProfileByContactValue = async (value) => {
            return await this.profileRepository
                .createQueryBuilder("profile")
                .leftJoinAndSelect("profile.contacts", "contact")
                .where("contact.value = :value", { value })
                .getOne();
        };
        // find profile by Id
        this.findProfileById = async (id) => {
            return await this.profileRepository.findOne({
                where: { id },
                relations: ["contacts", "address", "portfolio"]
            });
        };
        // find all profiles
        this.findAllProfiles = async () => {
            return await this.profileRepository.find({
                relations: ["contacts", "address", "portfolio"]
            });
        };
        // find contact by value
        this.findContactByValue = async (value) => {
            return await this.contactRepository.findOneBy({ value });
        };
        // update contact by profieId
        this.updateContactById = async (id, contactData) => {
            return await this.contactRepository.update({ id: id }, contactData);
        };
        this.profileRepository = dataSource_1.AppDataSource.getRepository("Profile");
        this.contactRepository = dataSource_1.AppDataSource.getRepository("Contact");
    }
}
exports.default = new RegistrationRepository();
