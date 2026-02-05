import { UnsupportedProviderError } from "../../../errors/unSupportedProviderError";
import { callProvider } from "../enums/callProvider";
import { CallProviderInterface } from "./callProviderInterface";
import twilioProvider from "./twilioProvider";


class CallProviderFactory{
    public async get(provider : callProvider): Promise<CallProviderInterface>{
        let concreteProvider= null
        switch(provider){
            case callProvider.TWILIO:
                concreteProvider= twilioProvider;
                break;

            default: 
                throw new UnsupportedProviderError("callProvider")
        }
        return concreteProvider;
    }
}

export default new CallProviderFactory()