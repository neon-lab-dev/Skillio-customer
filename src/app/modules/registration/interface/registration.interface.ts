import { contactType, proficiecy, profileStatus, ProfileType, roles, SocialMeida } from "../enums/registrationEnum";
import Decimal from "decimal.js"

export interface Location {
    latitude: number;
    longitude: number;
}

export interface TJwtConfig{
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
}

export interface TPinConfig{
    MAX_LENGTH: number;
}

export interface TAddressPinCodeConfig{
    INDIA: number;
}

export interface TProfileDetails{
  firstName?:string;
  lastName?: string;
  groupName?:string;
  nickName:string;
  status: profileStatus;
  profileType: ProfileType
}

export interface TContact {
  type: contactType;
  value: string;
  primary?: boolean;
  isVerified?: boolean;
  verificationId:string;
}


export interface TAddress {
  streetAddress: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
  location: Location
}

export interface THiringRate{
  hourlyPricing: Decimal;
  dailyPricing: Decimal;
  weeklyPricing: Decimal;
  monthlyPricing: Decimal;
}

export interface TFollows{
  socialMedia?: SocialMeida,
  link?: string,
  followers?: number,
  following?:number
}

export interface TPortfolio {
  category: string;
  subCategory: string;
  proficiency: proficiecy;
  bio?: string;
  totalEvents?: number;
  hiringRate: THiringRate;
  follows?: TFollows[];
  videoDocumentIds:string[];
  imageDocumentIds:string[];
  eventsDoneDocumentIds?:string[];
}


export interface TProfile {
  profileDetails: TProfileDetails;
  profileDocumentId:string;
  address: TAddress;
  portfolio: TPortfolio;
  role: roles
}