import { ProfileType, contactType, proficiecy } from "./enums/registrationEnum";
import { Location } from "./interface/registration.interface";

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
      verificationId: this.verificationId
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
  videoDocumentId:string;
  imageDocumentId:string;
  eventsDoneDocumentId:string;

  constructor(data: {
    category: string;
    subCategory: string;
    proficiency: proficiecy;
    totalEvents?: number;
    bio?: string;
    videoDocumentId:string;
    imageDocumentId:string;
    eventsDoneDocumentId:string;
  }) {
    this.category = data.category;
    this.subCategory = data.subCategory;
    this.proficiency = data.proficiency;
    this.totalEvents = data.totalEvents;
    this.bio = data.bio;
    this.videoDocumentId=data.videoDocumentId;
    this.imageDocumentId=data.imageDocumentId;
    this.eventsDoneDocumentId=data.eventsDoneDocumentId;
  }

  toJSON() {
    return {
      category: this.category,
      subCategory: this.subCategory,
      proficiency: this.proficiency,
      totalEvents: this.totalEvents,
      bio: this.bio,
      videoDocumentId:this.videoDocumentId,
      imageDocumentId:this.imageDocumentId,
      eventsDoneDocumentId:this.eventsDoneDocumentId
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
      bio: this.bio
    };
  }
}

export class GetRegistrationDTO {
  firstName?: string;
  lastName?: string;
  groupName?: string;
  nickName: string;
  profileType: ProfileType;
  contacts?: GetContactDTO[];
  address?: GetAddressDTO;
  portfolio?: GetPortfolioDTO;

  constructor(data: {
    firstName?: string;
    lastName?: string;
    groupName?: string;
    nickName: string;
    profileType: ProfileType;
    contacts?: Array<{
      type: contactType;
      value: string;
      primary?: boolean;
      isVerified?: boolean;
    }>;
    address?: {
      streetAddress: string;
      city: string;
      country: string;
      state: string;
      pinCode: number;
      location: Location;
    };
    portfolio?: {
      category: string;
      subCategory: string;
      proficiency: proficiecy;
      totalEvents?: number;
      bio?: string;
    };
  }) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.groupName = data.groupName;
    this.nickName = data.nickName;
    this.profileType = data.profileType;
    
    this.contacts = data.contacts?.map(
      contact => new GetContactDTO(contact)
    );
    
    this.address = data.address 
      ? new GetAddressDTO(data.address) 
      : undefined;
    
    this.portfolio = data.portfolio 
      ? new GetPortfolioDTO(data.portfolio) 
      : undefined;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      groupName: this.groupName,
      nickName: this.nickName,
      profileType: this.profileType,
      contacts: this.contacts?.map(contact => contact.toJSON()),
      address: this.address?.toJSON(),
      portfolio: this.portfolio?.toJSON()
    };
  }
}