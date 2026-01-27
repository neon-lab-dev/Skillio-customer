import { contactType, proficiecy, ProfileType, roles } from "../enums/registrationEnum";
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

export interface TPortfolio {
  category: string;
  subCategory: string;
  proficiency: proficiecy;
  bio?: string;
  totalEvents?: number;
  hiringRate: THiringRate;
  videoDocumentId:string;
  imageDocumentId:string;
  eventsDoneDocumentId?:string;
}

export interface THiringRate{
  hourlyPricing: Decimal;
  dailyPricing: Decimal;
  weeklyPricing: Decimal;
  monthlyPricing: Decimal;
}

export interface TProfile {
  firstName?: string;
  lastName?: string;
  groupName?: string;
  nickName: string;
  profileType: ProfileType;
  pin: string;
  profileDocumentId:string;
  contacts: TContact[];
  address: TAddress;
  portfolio: TPortfolio;
  role: roles
}