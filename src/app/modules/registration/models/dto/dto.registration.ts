import { privacyType } from "../../../privacy/enums/privacyEnum";
import { ProfileType, SocialMeida, contactType, onlineStatus, proficiecy, roles } from "../../enums/registrationEnum";
import { Location, THiringRate } from "../../interface/registration.interface";
import Decimal from "decimal.js"

// Contact DTO
export class ContactDTO {
  type: contactType;
  value: string;
  primary?: boolean;
  isVerified?: boolean;
  verificationId:string;
  

  constructor(data: {
    type: contactType;
    value: string;
    primary?: boolean;
    isVerified?: boolean;
    verificationId:string;
  }) {
    this.type = data.type;
    this.value = data.value;
    this.primary = data.primary ?? true;
    this.isVerified = data.isVerified ?? false;
    this.verificationId= data.verificationId;
  }

  toJSON() {
    return {
      type: this.type,
      value: this.value,
      primary: this.primary,
      isVerified: this.isVerified,
      verificationId: this.verificationId,
    };
  }
}

// Address DTO
export class AddressDTO {
  streetAddress: string;
  city: string;
  country: string;
  state: string;
  pinCode: number;
  location: Location;

  constructor(data: {
    streetAddress: string;
    city: string;
    country: string;
    state: string;
    pinCode: number;
    location: Location;
  }) {
    this.streetAddress = data.streetAddress;
    this.city = data.city;
    this.country = data.country;
    this.state = data.state;
    this.pinCode = data.pinCode;
    this.location = data.location;
  }

  toJSON() {
    return {
      streetAddress: this.streetAddress,
      city: this.city,
      country: this.country,
      state: this.state,
      pinCode: this.pinCode,
      location: this.location
    };
  }
}

// portfolio Dto
export class PortfolioDTO {
  category: string;
  subCategory: string;
  proficiency: proficiecy;
  totalEvents?: number;
  bio?: string;
  hiringRate: THiringRate;
  follows: {
    socialMedia: SocialMeida,
    link:string,
    followers?: number,
    following?: number
  }[];
  videoDocumentIds:string[];
  imageDocumentIds:string[];
  eventsDoneDocumentIds:string[];

  constructor(data: {
    category: string;
    subCategory: string;
    proficiency: proficiecy;
    totalEvents?: number;
    bio?: string;
    hiringRate: THiringRate;
    follows: {
    socialMedia: SocialMeida,
    link:string,
    followers?: number,
    following?: number
  }[];
    videoDocumentIds:string[];
    imageDocumentIds:string[];
    eventsDoneDocumentIds:string[];
  }) {
    this.category = data.category;
    this.subCategory = data.subCategory;
    this.proficiency = data.proficiency;
    this.totalEvents = data.totalEvents;
    this.bio = data.bio;
    this.follows= data.follows?.map(follow=> new FollowsDTO(follow));
    this.hiringRate= data.hiringRate;
    this.videoDocumentIds=data.videoDocumentIds;
    this.imageDocumentIds=data.imageDocumentIds;
    this.eventsDoneDocumentIds=data.eventsDoneDocumentIds;
  }

  toJSON() {
    return {
      category: this.category,
      subCategory: this.subCategory,
      proficiency: this.proficiency,
      totalEvents: this.totalEvents,
      bio: this.bio,
      hiringRate: this.hiringRate,
      follows: this.follows,
      videoDocumentIds:this.videoDocumentIds,
      imageDocumentIds:this.imageDocumentIds,
      eventsDoneDocumentIds:this.eventsDoneDocumentIds
    };
  }
}

// Registration DTO
export class RegistrationDTO {
  firstName?: string;
  lastName?: string;
  groupName?: string;
  pin: string;
  nickName: string;
  profileType: ProfileType;
  profileDocumentId:string;
  role: roles;

  contacts: ContactDTO[];
  address: AddressDTO;
  portfolio: PortfolioDTO;

  constructor(data: {
    firstName?: string;
    lastName?: string;
    groupName?: string;
    pin: string;
    nickName: string;
    profileType: ProfileType;
    profileDocumentId:string;
    contacts: ContactDTO[];
    address: AddressDTO;
    portfolio: PortfolioDTO;
    role: roles;
  }) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.groupName = data.groupName;
    this.pin = data.pin;
    this.nickName = data.nickName;
    this.profileType = data.profileType;
    this.profileDocumentId=data.profileDocumentId;
    this.contacts = data.contacts.map(contact => new ContactDTO(contact));
    this.address = new AddressDTO(data.address);
    this.portfolio = new PortfolioDTO(data.portfolio);
    this.role= data.role
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      pin: this.pin,
      nickName: this.nickName,
      profileType: this.profileType,
      profileDocumentId:this.profileDocumentId,
      role: this.role,
      contacts: this.contacts.map(contact => contact.toJSON()),
      address: this.address.toJSON(),
      portfolio: this.portfolio.toJSON()
    };
  }
}

export class GetContactDTO {
  type: contactType;
  value: string;
  primary: boolean;
  isVerified: boolean;

  constructor(data: {
    type: contactType;
    value: string;
    primary?: boolean;
    isVerified?: boolean;
  }) {
    this.type = data.type;
    this.value = data.value;
    this.primary = data.primary ?? false;
    this.isVerified = data.isVerified ?? false;
  }
 
  toJSON() {
    return {
      type: this.type,
      value: this.value,
      primary: this.primary,
      isVerified: this.isVerified
    };
  }
}

export class GetAddressDTO {
  streetAddress: string;
  city: string;
  country: string;
  state: string;
  pinCode: number;
  location: Location;

  constructor(data: {
    streetAddress: string;
    city: string;
    country: string;
    state: string;
    pinCode: number;
    location: Location;
  }) {
    this.streetAddress = data.streetAddress;
    this.city = data.city;
    this.country = data.country;
    this.state = data.state;
    this.pinCode = data.pinCode;
    this.location = data.location;
  }

  toJSON() {
    return {
      streetAddress: this.streetAddress,
      city: this.city,
      country: this.country,
      state: this.state,
      pinCode: this.pinCode,
      location: this.location
    };
  }
}


export class GetPortfolioDTO {
  category: string;
  subCategory: string;
  proficiency: proficiecy;
  totalEvents?: number;
  bio?: string;

  constructor(data: {
    category: string;
    subCategory: string;
    proficiency: proficiecy;
    totalEvents?: number;
    bio?: string;
  }) {
    this.category = data.category;
    this.subCategory = data.subCategory;
    this.proficiency = data.proficiency;
    this.totalEvents = data.totalEvents;
    this.bio = data.bio;
  }

  toJSON() {
    return {
      category: this.category,
      subCategory: this.subCategory,
      proficiency: this.proficiency,
      totalEvents: this.totalEvents,
      bio: this.bio,
    };
  }
}

export class GetRegistrationDTO {
  firstName?: string;
  lastName?: string;
  groupName?: string;
  nickName: string;
  profileType: ProfileType;
  contacts: GetContactDTO[];
  address: GetAddressDTO;
  portfolio: GetPortfolioDTO;

  constructor(data: {
    firstName?: string;
    lastName?: string;
    groupName?: string;
    nickName: string;
    profileType: ProfileType;
    contacts: Array<{
      type: contactType;
      value: string;
      primary?: boolean;
      isVerified?: boolean;
    }>;
    address: {
      streetAddress: string;
      city: string;
      country: string;
      state: string;
      pinCode: number;
      location: Location;
    };
    portfolio: {
      category: string;
      subCategory: string;
      proficiency: proficiecy;
      totalEvents?: number;
      bio?: string;
      hiringRate: {
        dailyPricing: Decimal;
        hourlyPricing: Decimal;
        weeklyPricing: Decimal;
        monthlyPricing: Decimal;
      };
      follows: {
        socialMedia: SocialMeida;
        link: string;
        followers?: number;
        following?: number;
      }[]
    };
  }) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.groupName = data.groupName;
    this.nickName = data.nickName;
    this.profileType = data.profileType;
    
    this.contacts = data.contacts.map(
      contact => new GetContactDTO(contact)
    );
    
    this.address = new GetAddressDTO(data.address) 
    
    this.portfolio =  new GetPortfolioDTO(data.portfolio) 
  }
  
  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      nickName: this.nickName,
      profileType: this.profileType,
      contacts: this.contacts.map(contact => contact.toJSON()),
      address: this.address.toJSON(),
      portfolio: this.portfolio.toJSON()
    };
  }
}

export class FollowsDTO{
    socialMedia: SocialMeida;
    link: string;
    followers?: number;
    following?:number;

    constructor(data: {
      socialMedia: SocialMeida,
      link: string,
      followers?: number,
      following?: number
    }){
      this.socialMedia= data.socialMedia;
      this.link= data.link;
      this.followers= data?.followers;
      this.following= data?.following;
    }

    toJSON(){
      return{
        socialMedia: this.socialMedia,
        link: this.link,
        followers: this.followers,
        following: this.following
      }
    }
}
export class GetProfilePortfolioDTO{
  id:string;
  bio?: string;
  follows? : FollowsDTO[]; 

  constructor(data:{
    id:string;
    bio?: string;
    follows?: FollowsDTO[];
  }){
    this.id=data.id;
    this.bio=data.bio;
    this.follows= data.follows?.map(
      follow=> new FollowsDTO(follow)
    );
  }

  toJSON(){
    return {
      id: this.id,
      bio: this.bio,
      follows: this.follows
    }
  }
}

// get profile dto
export class GetProfileDTO{
  firstName?: string;
  lastName?: string
  groupName?: string;
  profileType!: ProfileType;
  nickName!: string;
  portfolio: GetProfilePortfolioDTO;
  contacts: GetContactDTO[];
  isSubscribed: boolean;
  online?:{
    status: onlineStatus;
    lastSeen: Date | null;
  };
  privacy:{
    type: privacyType
  }

  constructor(data:{
    firstName?: string;
    lastName?: string
    groupName?: string;
    nickName: string;
    profileType:string;
    isSubscribed: boolean;
    contacts: Array<{
      type: contactType;
      value: string;
    }>;
    portfolio:{
      id:string;
      bio?: string; 
      hiringRate: THiringRate;
         follows: {
        socialMedia: SocialMeida;
        link: string;
        followers?: number;
        following?: number;
      }[];
    };
    online?:{
      status: onlineStatus;
      lastSeen: Date | null;
    };
    privacy:{
      type: privacyType
    }
  }){
    this.firstName=data.firstName;
    this.lastName=data.lastName;
    this.groupName=data.groupName;
    this.nickName=data.nickName;
    this.profileType=data.profileType as ProfileType;
    this.isSubscribed=data.isSubscribed;
    this.contacts=data.contacts.map(contact=>new GetContactDTO(contact));
    this.portfolio=new GetProfilePortfolioDTO({
      id: data.portfolio.id,
      bio: data.portfolio.bio || "",
      follows: data.portfolio?.follows?.map(follow=> new FollowsDTO(follow))
    })
    this.online=data.online?{
      status: data.online.status,
      lastSeen: data.online.lastSeen
    } : undefined;
    this.privacy= data.privacy;
  }

  toJSON(){
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      nickName: this.nickName,
      profileType: this.profileType,
      isSubscribed: this.isSubscribed,
      contacts: this.contacts.map(contact=>contact.toJSON()),
      portfolio: this.portfolio.toJSON(),
      online: this.online,
      privacy: this.privacy
    }
  }
}
