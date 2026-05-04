import { ProfileType, SocialMeida, addressType, contactType, onlineStatus, proficiecy, profileStatus, roles } from "../../enums/registrationEnum";
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
  type: addressType;
  city: string;
  country: string;
  state: string;
  pinCode: number;
  location: Location;

  constructor(data: {
    streetAddress: string;
    type: addressType;
    city: string;
    country: string;
    state: string;
    pinCode: number;
    location: Location;
  }) {
    this.streetAddress = data.streetAddress;
    this.type= data.type;
    this.city = data.city;
    this.country = data.country;
    this.state = data.state;
    this.pinCode = data.pinCode;
    this.location = data.location;
  }

  toJSON() {
    return {
      streetAddress: this.streetAddress,
      type: this.type,
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
  hiringRate: {
    hourlyPricing: Decimal,
    dailyPricing: Decimal,
    weeklyPricing: Decimal,
    monthlyPricing: Decimal
  };
  follows?: {
    socialMedia?: SocialMeida,
    link?:string,
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
    hiringRate: {
      hourlyPricing: Decimal,
      dailyPricing: Decimal,
      weeklyPricing: Decimal,
      monthlyPricing: Decimal
    };
    follows?: {
    socialMedia?: SocialMeida,
    link?:string,
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

export class ProfileDetailsDto {
  firstName?: string;
  lastName?:string;
  groupName?: string;
  nickName!: string;
  status!: profileStatus;
  address: AddressDTO[];
  profileType!:ProfileType;

  constructor(data: {
    firstName?: string,
    lastName?:string,
    groupName?:string,
    nickName:string,
    status: profileStatus,
    profileType: ProfileType
  address: AddressDTO[];
  }) {
    this.firstName= data.firstName;
    this.lastName= data.lastName;
    this.groupName= data.groupName;
    this.nickName= data.nickName;
    this.status= data.status;
    this.profileType= data.profileType;
    this.address = data.address.map(address => new AddressDTO(address));

  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      nickName: this.nickName,
      status: this.status,
      profileType:this.profileType,
      address: this.address.map(address=>address.toJSON())
    };
  }
}


// Registration DTO
export class RegistrationDTO {
  profileDetails: ProfileDetailsDto
  profileDocumentId:string;
  role: roles;
  contacts: ContactDTO[];
  portfolio: PortfolioDTO;

  constructor(data: {
    profileDetails: ProfileDetailsDto,
    profileDocumentId:string;
    role: roles;
    contacts: ContactDTO[];
    portfolio: PortfolioDTO;
  }) {
    this.profileDetails=  new ProfileDetailsDto(data.profileDetails);
    this.profileDocumentId=data.profileDocumentId;
    this.role= data.role;
     this.contacts = data.contacts.map(contact => new ContactDTO(contact));
    this.portfolio = new PortfolioDTO(data.portfolio);
  }

  toJSON() {
    return {
      profileDetails: this.profileDetails.toJSON(),
      contacts: this.contacts.map(contact => contact.toJSON()),
      role: this.role,
      profileDocumentId: this.profileDocumentId,
      portfolio: this.portfolio.toJSON()
    };
  }
}

export class GetProfileDetailsDto {
  firstName?: string | undefined;
  lastName?:string | undefined;
  groupName?: string | undefined;
  nickName: string |undefined;
  status: profileStatus;
  profileType:ProfileType

  constructor(data: {
    firstName?: string | undefined,
    lastName?:string | undefined,
    groupName?:string | undefined,
    nickName:string|undefined,
    status: profileStatus,
    profileType: ProfileType
  }) {
    this.firstName= data.firstName;
    this.lastName= data.lastName;
    this.groupName= data.groupName;
    this.nickName= data.nickName;
    this.status= data.status;
    this.profileType= data.profileType;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      nickName: this.nickName,
      status: this.status,
      profileType:this.profileType
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
  type: addressType;
  city: string;
  country: string;
  state: string;
  pinCode: number;
  location: Location;

  constructor(data: {
    streetAddress: string;
  type: addressType;
    city: string;
    country: string;
    state: string;
    pinCode: number;
    location: Location;
  }) {
    this.streetAddress = data.streetAddress;
    this.type= data.type;
    this.city = data.city;
    this.country = data.country;
    this.state = data.state;
    this.pinCode = data.pinCode;
    this.location = data.location;
  }

  toJSON() {
    return {
      streetAddress: this.streetAddress,
      type: this.type,
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
  profileDetails: GetProfileDetailsDto;
  address: GetAddressDTO[];
   contacts: GetContactDTO[];
  portfolio: GetPortfolioDTO;

  constructor(data: {
    profileDetails:{
      firstName?: string | undefined,
      lastName?:string | undefined,
      groupName?: string | undefined,
      nickName: string | undefined,
      status: profileStatus,
      profileType:ProfileType
    },
    contacts: Array<{
      type: contactType;
      value: string;
      primary?: boolean;
      isVerified?: boolean;
    }>;
    address: {
      streetAddress: string;
      type: addressType;
      city: string;
      country: string;
      state: string;
      pinCode: number;
      location: Location;
    }[];
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
    this.profileDetails= new GetProfileDetailsDto(data.profileDetails)
    
    this.contacts = data.contacts.map(
      contact => new GetContactDTO(contact)
    );
    this.address =data.address.map((val)=>new GetAddressDTO(val) ) 
    
    this.portfolio =  new GetPortfolioDTO(data.portfolio) 
  }
  
  toJSON() {
    return {
      profileDetails: this.profileDetails?.toJSON(),
      address: this.address.map(val=>val.toJSON()),
      portfolio: this.portfolio.toJSON()
    };
  }
}

export class FollowsDTO{
    socialMedia?: SocialMeida;
    link?: string;
    followers?: number;
    following?:number;

    constructor(data: {
      socialMedia?: SocialMeida,
      link?: string,
      followers?: number,
      following?: number
    }){
      this.socialMedia= data?.socialMedia;
      this.link= data?.link;
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
  category!:string;
  subCategory!:string;

  constructor(data:{
    id:string;
    bio?: string;
    follows?: FollowsDTO[];
    category: string;
    subCategory:string;
  }){
    this.id=data.id;
    this.bio=data.bio;
    this.category= data.category;
    this.subCategory= data.subCategory;
    this.follows= data.follows?.map(
      follow=> new FollowsDTO(follow)
    );
  }

  toJSON(){
    return {
      id: this.id,
      bio: this.bio,
      category: this.category,
      subCategory: this.subCategory,
      follows: this.follows
    }
  }
}

// get profile dto
export class GetProfileDTO{
  profileDetails: GetProfileDetailsDto;
  portfolio: GetProfilePortfolioDTO;
  contacts: GetContactDTO[];
  isSubscribed: boolean;
  online?:{
    status: onlineStatus;
    lastSeen: Date | null;
  }

  constructor(data:{
    profileDetails: {
      firstName?: string | undefined,
      lastName?:string | undefined,
    groupName?: string | undefined,
    nickName: string,
    status: profileStatus,
    profileType:ProfileType
    },
    isSubscribed: boolean;
    contacts: Array<{
      type: contactType;
      value: string;
    }>;
    portfolio:{
      id:string;
      bio?: string; 
      category:string;
      subCategory: string;
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
    }
  }){
    this.isSubscribed=data.isSubscribed;
    this.contacts = Array.isArray(data.contacts) ? data.contacts.map(contact => new GetContactDTO(contact)) : [];
    this.profileDetails= new GetProfileDetailsDto(data.profileDetails);
    this.portfolio=new GetProfilePortfolioDTO({
      id: data.portfolio.id,
      bio: data.portfolio.bio || "",
      category: data.portfolio.category,
      subCategory: data.portfolio.subCategory,
      follows: data.portfolio?.follows?.map(follow=> new FollowsDTO(follow))
    })
    this.online=data.online?{
      status: data.online.status,
      lastSeen: data.online.lastSeen
    } : undefined;
  }

  toJSON(){
    return {
      profileDetails: this.profileDetails,
      isSubscribed: this.isSubscribed,
      contacts: this.contacts.map(contact=>contact.toJSON()),
      portfolio: this.portfolio.toJSON(),
      online: this.online
    }
  }
}
