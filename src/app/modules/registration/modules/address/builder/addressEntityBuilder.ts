import { Address } from "../../../../../entity/address";
import { CreateAddressRequest } from "../request/createAddressRequest";

export class AddressEntityBuilder{
    private entity: Address;

    private constructor(){
        this.entity= new Address;
    }

    public static builder(): AddressEntityBuilder{
        return new AddressEntityBuilder()
    }

    public of(req: CreateAddressRequest , profileId: string): AddressEntityBuilder{
        this.entity.city= req.city;
        this.entity.country= req.country;
        this.entity.location= req.location;
        this.entity.pinCode= req.pinCode;
        this.entity.state= req.state;
        this.entity.streetAddress= req.streetAddress
        this.entity.type= req.type;
        this.entity.profileId= profileId;


        return this;
    }

    public build(): Address{
        return this.entity;
    }
}