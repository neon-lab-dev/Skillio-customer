import { AppRequest } from "@neon-lab-dev/platform";
import { addressType } from "../../../enums/registrationEnum";
import { Location } from "../../../interface/registration.interface";

export class CreateAddressRequest implements AppRequest{
    streetAddress!: string;
    type!: addressType;
    city!: string;
    state!: string;
    country!: string;
    pinCode!: number;
    location!: Location
}