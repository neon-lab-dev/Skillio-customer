import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository } from "typeorm";
import { Profile } from "../entity/profile";
import { Contact } from "../entity/contact";
import { contactType, proficiecy, ProfileType } from "../modules/registration/enums/registrationEnum";

class RegistrationRepository{

    private profileRepository: Repository<Profile>;
    private contactRepository: Repository<Contact>;

    private buildCountQuery(
        profileType: ProfileType = ProfileType.INDIVIDUAL,
        proficiency: proficiecy
    ) {
        const query = this.profileRepository
        .createQueryBuilder("profile")
        .leftJoinAndSelect("profile.portfolio", "portfolio")
        .where("profile.profileType = :profileType", { profileType })
        .andWhere("portfolio.proficiency = :proficiency", { proficiency });
    
        return query.getCount();
    }

    constructor() {
        this.profileRepository = AppDataSource.getRepository<Profile>("Profile");
        this.contactRepository = AppDataSource.getRepository<Contact>("Contact");
    }


    // create/register a profile
    createProfile= async(profileData: DeepPartial<Profile>)=>{
        const newProfile=this.profileRepository.create(profileData);
        return await this.profileRepository.save(newProfile);
    }

    // update a profile
    updateProfile= async(id:string , profileData: DeepPartial<Profile>)=>{
        return await this.profileRepository.update(id , profileData);
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

    // find profile by Id
    findProfileById= async(id:string)=>{
        return await this.profileRepository.findOne({
            where:{id},
            relations:["contacts" , "address" , "portfolio" , "online"]
        });
    }

    // find all profiles
    findAllProfiles= async(page: string , limit:string)=>{
        const profilesLimit= parseInt(limit) || 10;
        const profilesPage= parseInt(page) || 1;
        const skip= (profilesPage - 1) * profilesLimit;

        return await this.profileRepository.find({
            relations:["contacts" , "address" , "portfolio"],
            take: profilesLimit,
            skip: skip
        });
    }

    getProfileCount= async()=>{
        const totalCount= await this.profileRepository.count();
        const individualProfessional= await this.buildCountQuery(ProfileType.INDIVIDUAL , proficiecy.PROFESSIONAL);
        const individualSkilled= await this.buildCountQuery(ProfileType.INDIVIDUAL , proficiecy.SKILLED);
        const groupProfessional= await this.buildCountQuery(ProfileType.GROUP , proficiecy.PROFESSIONAL);
        const groupSkilled= await this.buildCountQuery(ProfileType.GROUP , proficiecy.SKILLED);

        return{
            totalCount: totalCount,
            individualsCount:{
                professional: individualProfessional,
                skilled: individualSkilled
            },
            groupCount:{
                professional: groupProfessional,
                skilled: groupSkilled
            }
        }
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