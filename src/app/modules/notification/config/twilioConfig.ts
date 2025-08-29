import { SystemConfig } from "../../../entity/systemConfig";

let twilioConfig: SystemConfig | undefined;

export const loadTwilioConfig= async(configs:SystemConfig[])=>{
    twilioConfig= configs.find(config=>config.medium==="SMS");
}


export const getTwilioConfig = async(): Promise<SystemConfig | undefined >=> {
    return twilioConfig;
}
