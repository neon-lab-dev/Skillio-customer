import { AppResponseData } from "@neon-lab-dev/platform";
import { TAddress, TFollows, THiringRate } from "../../interface/registration.interface";
import { proficiecy } from "../../enums/registrationEnum";

export class FetchProfileDetailsResponseDto implements AppResponseData{
    firstName?: string;

    lastName?:string;

    groupName?:string;

    nickName!:string;

    status!:string;

    profileType!:string;

    isSubscribed!:boolean;

    address!: TAddress;

    createdAt!: Date;

    updatedAt!: Date;


    portfolio!: {
          category: string;
          subCategory: string;
          proficiency: proficiecy;
          bio?: string;
          totalEvents?: number;
          follows?: TFollows | undefined;
          hiringRate: THiringRate;
        }
        
}