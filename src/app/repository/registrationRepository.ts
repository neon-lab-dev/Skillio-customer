import { AppDataSource } from "../db/dataSource";
import { DeepPartial } from "typeorm";
import { Profile } from "../entity/profile";
import { Contact } from "../entity/contact";
import { contactType, proficiecy, profileStatus, ProfileType, roles } from "../modules/registration/enums/registrationEnum";
import { BaseRepository } from "@neon-lab-dev/platform";
import { HiringRate } from "../entity/hiringRate";
import { Portfolio } from "../entity/portfolio";

class RegistrationRepository extends BaseRepository<Profile>{

    private contactRepository= AppDataSource.getRepository<Contact>("Contact");
    private hiringRateRepository= AppDataSource.getRepository<HiringRate>("HiringRate");
    private portfolioReposiotry= AppDataSource.getRepository<Portfolio>("portfolio");


    private buildCountQuery(
        profileType: ProfileType,
        proficiency: proficiecy
    ) {
        return this.repository
        .createQueryBuilder("profile")
        .leftJoinAndSelect("profile.portfolio", "portfolio")
        .andWhere("portfolio.proficiency = :proficiency", { proficiency })
        .andWhere("profile.profileType = :profileType", { profileType })
        .getCount()
    }

    private proficiencyCountQuery(proficiency:proficiecy){
        return this.repository.
        createQueryBuilder("profile")
        .leftJoinAndSelect("profile.portfolio", "portfolio")
        .where("portfolio.proficiency = :proficiency", { proficiency })
        .getCount()
    }

    private profileTypeCountQuery(profileType: ProfileType){
        return this.repository.
        createQueryBuilder("profile")
        .where("profile.profileType = :profileType", { profileType })
        .getCount();
    }

    private prfileStatusCountQuery(profileStatus: profileStatus){
        return this.repository.
        createQueryBuilder("profile")
        .where("profile.status= :profileStatus" , {profileStatus})
        .getCount()
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

    async updatePortfolio(portfolioId:string , portfolioData:DeepPartial<Portfolio>){
        return await this.portfolioReposiotry.update({id:portfolioId }, portfolioData);
    }


    // findProfileByContactValue
    findProfileByCredential = async(credential: string) => {
        return await this.repository
            .createQueryBuilder("profile")
            .leftJoinAndSelect("profile.contacts", "contact")
            .leftJoinAndSelect("profile.portfolio" , "portfolio")
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

    async findHiringRateById(id: string):Promise<HiringRate | null>{
        return await this.hiringRateRepository.findOneBy({
            id: id
        });
    }
    
    async updateHiringRate(id:string , updatedData: DeepPartial<HiringRate>){
        return await this.hiringRateRepository.update(id , updatedData);
    }

    getProfileCount= async()=>{
        const totalCount= await this.repository.count();
        const totalIndividuals= await this.profileTypeCountQuery(ProfileType.INDIVIDUAL)
        const individualProfessional= await this.buildCountQuery(ProfileType.INDIVIDUAL , proficiecy.PROFESSIONAL);
        const individualSkilled= await this.buildCountQuery(ProfileType.INDIVIDUAL , proficiecy.SKILLED);
        const totalGroup= await this.profileTypeCountQuery(ProfileType.GROUP);
        const groupProfessional= await this.buildCountQuery(ProfileType.GROUP , proficiecy.PROFESSIONAL);
        const groupSkilled= await this.buildCountQuery(ProfileType.GROUP , proficiecy.SKILLED);
        const totalProfessional= await this.proficiencyCountQuery(proficiecy.PROFESSIONAL)
        const totalSkilled= await this.proficiencyCountQuery(proficiecy.SKILLED)
        const pendingVerifications= await this.prfileStatusCountQuery(profileStatus.PENDING);
        return{
            totalCount: totalCount,
            individualsCount:{
                total: totalIndividuals,
                professional: individualProfessional,
                skilled: individualSkilled
            },
            groupCount:{
                total: totalGroup,
                professional: groupProfessional,
                skilled: groupSkilled
            },
            totalProfessional: totalProfessional,
            totalSkilled: totalSkilled,
            pendingVerifications: pendingVerifications
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