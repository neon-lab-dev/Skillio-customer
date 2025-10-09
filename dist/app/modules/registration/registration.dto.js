"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegistrationDTO = exports.GetPortfolioDTO = exports.GetAddressDTO = exports.GetContactDTO = exports.RegistrationDTO = exports.PortfolioDTO = exports.AddressDTO = exports.ContactDTO = void 0;
// Contact DTO
class ContactDTO {
    constructor(data) {
        this.type = data.type;
        this.value = data.value;
        this.primary = data.primary ?? true;
        this.isVerified = data.isVerified ?? false;
        this.verificationId = data.verificationId;
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
exports.ContactDTO = ContactDTO;
// Address DTO
class AddressDTO {
    constructor(data) {
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
exports.AddressDTO = AddressDTO;
// portfolio Dto
class PortfolioDTO {
    constructor(data) {
        this.category = data.category;
        this.subCategory = data.subCategory;
        this.proficiency = data.proficiency;
        this.totalEvents = data.totalEvents;
        this.bio = data.bio;
        this.videoDocumentId = data.videoDocumentId;
        this.imageDocumentId = data.imageDocumentId;
        this.eventsDoneDocumentId = data.eventsDoneDocumentId;
    }
    toJSON() {
        return {
            category: this.category,
            subCategory: this.subCategory,
            proficiency: this.proficiency,
            totalEvents: this.totalEvents,
            bio: this.bio,
            videoDocumentId: this.videoDocumentId,
            imageDocumentId: this.imageDocumentId,
            eventsDoneDocumentId: this.eventsDoneDocumentId
        };
    }
}
exports.PortfolioDTO = PortfolioDTO;
// Registration DTO
class RegistrationDTO {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.groupName = data.groupName;
        this.pin = data.pin;
        this.nickName = data.nickName;
        this.profileType = data.profileType;
        this.profileDocumentId = data.profileDocumentId;
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
            profileDocumentId: this.profileDocumentId,
            contacts: this.contacts.map(contact => contact.toJSON()),
            address: this.address.toJSON(),
            portfolio: this.portfolio.toJSON()
        };
    }
}
exports.RegistrationDTO = RegistrationDTO;
class GetContactDTO {
    constructor(data) {
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
exports.GetContactDTO = GetContactDTO;
class GetAddressDTO {
    constructor(data) {
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
exports.GetAddressDTO = GetAddressDTO;
class GetPortfolioDTO {
    constructor(data) {
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
exports.GetPortfolioDTO = GetPortfolioDTO;
class GetRegistrationDTO {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.groupName = data.groupName;
        this.nickName = data.nickName;
        this.profileType = data.profileType;
        this.contacts = data.contacts?.map(contact => new GetContactDTO(contact));
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
exports.GetRegistrationDTO = GetRegistrationDTO;
