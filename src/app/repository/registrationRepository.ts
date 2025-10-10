import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository } from "typeorm";
import { Profile } from "../entity/profile";
import { Contact } from "../entity/contact";
import { contactType } from "../modules/registration/enums/registrationEnum";

class RegistrationRepository{

    private profileRepository: Repository<Profile>;
    private contactRepository: Repository<Contact>;

    constructor() {
        this.profileRepository = AppDataSource.getRepository<Profile>("Profile");
        this.contactRepository = AppDataSource.getRepository<Contact>("Contact");
    }


    // create/register a profile
    createProfile= async(profileData: DeepPartial<Profile>)=>{
        const newProfile=this.profileRepository.create(profileData);
        return await this.profileRepository.save(newProfile);
    }

    // findProfileByContactValue
    findProfileByCredential = async(credential: string) => {
        return await this.profileRepository
            .createQueryBuilder("profile")
            .leftJoinAndSelect("profile.contacts", "contact")
            .where("profile.nickName = :credential", { credential })
            .orWhere(
                "contact.value = :credential AND contact.type IN (:...types)",
                { 
                    credential, 
                    types: [contactType.PHONE, contactType.EMAIL] 
                }
            )
            .getOne();
    }

    findProfileByContactValue= async(value:string)=>{
        return await this.profileRepository
            .createQueryBuilder("profile")
            .leftJoinAndSelect("profile.contacts", "contact")
            .where("contact.value = :value", {value})
            .getOne();
    }

    // find contact by value
    findContactByValue= async(value:string)=>{
        return await this.contactRepository.findOneBy({value});
    }

    // update contact by profieId
    updateContactById= async(id:string , contactData: DeepPartial<Contact>)=>{
        return await this.contactRepository.update({id:id}, contactData);
    }


}

export default new RegistrationRepository();