import { CallProviderInterface } from "./callProviderInterface";
import { getTwilioonfig } from "../config/twilioConfig";
import { jwt } from "twilio";

class TwilioProvider implements CallProviderInterface{
    public async getToken(identity: string): Promise<string> {
        const config=await getTwilioonfig()
        const accessToken = jwt.AccessToken;
        const voice= accessToken.VoiceGrant
        const token= new accessToken(
            config.TWILIO_ACCOUNT_SID,
            config.TWILIO_API_KEY,
            config.TWILIO_API_SECRET,
            {identity}
        )

        const voiceGrant = new voice({
            outgoingApplicationSid: config.TWILIO_TWIML_APP_SID,
            incomingAllow: true, 
            pushCredentialSid: config.TWILIO_PUSH_CREDENTIAL_SID
        });

        token.addGrant(voiceGrant);

        return token.toJwt();

    }
}

export default new TwilioProvider();