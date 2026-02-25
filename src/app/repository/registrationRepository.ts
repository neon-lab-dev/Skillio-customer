import { AppDataSource } from "../db/dataSource";
import { DeepPartial } from "typeorm";
import { Profile } from "../entity/profile";
import { Contact } from "../entity/contact";
import { contactType, proficiecy, ProfileType, roles } from "../modules/registration/enums/registrationEnum";
import { BaseRepository } from "@neon-lab-dev/platform";
import { HiringRate } from "../entity/hiringRate";

class RegistrationRepository extends BaseRepository<Profile>{

    private contactRepository= AppDataSource.getRepository<Contact>("Contact");
    private hiringRateRepository= AppDataSource.getRepository<HiringRate>("HiringRate");

    private buildCountQuery(
        profileType: ProfileType = ProfileType.INDIVIDUAL,
        proficiency: proficiecy
    ) {
        const query = this.repository
        .createQueryBuilder("profile")
        .leftJoinAndSelect("profile.portfolio", "portfolio")
        .where("profile.profileType = :profileType", { profileType })
        .andWhere("portfolio.proficiency = :proficiency", { proficiency });
    
        return query.getCount();
    }

    constructor() {
        super(AppDataSource , Profile)
    }


    // create/register a profile
    createProfile= async(profileData: DeepPartial<Profile>)=>{
        const newProfile=this.repository.create(profileData);
        return await this.repository.save(newProfile);
    }

    // update a profile
    updateProfile= async(id:string , profileData: DeepPartial<Profile>)=>{
        return await this.repository.update(id , profileData);
    }

    // findProfileByContactValue
    findProfileByCredential = async(credential: string) => {
        return await this.repository
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
        return await this.repository
            .createQueryBuilder("profile")
            .leftJoinAndSelect("profile.contacts", "contact")
            .where("contact.value = :value", {value})
            .getOne();
    }

    // find profile by Id
    findProfileById= async(id:string)=>{
        return await this.repository.findOne({
            where:{id},
            relations:["contacts" , "address" , "portfolio" , "portfolio.follows" , "portfolio.hiringRate"   , "online"]
        });
    }

    async findHiringRate(portfolioId: string){
        return await this.hiringRateRepository.findOne({
            where:{ 
                portfolioId
            }
        })
    }

    getProfileCount= async()=>{
        const totalCount= await this.repository.count();
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

    async findByRole(role: roles){
        return await this.repository.findBy({role})
    }
}

export default new RegistrationRepository();