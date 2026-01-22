import { Notification } from "../../../entity/notification";
import { ProviderResult } from "../../../providers/interface/notification.provider.interface";
import NotificationProviderFactory from "../../../providers/NotificationProviderFactory";

class communicationService {

  async sendNotification(notification: Partial<Notification>): Promise<ProviderResult> {
    // 1. Factory resolves correct provider (SMS, EMAIL, PUSH)
    const provider = NotificationProviderFactory.resolve(notification);


    if(!provider){
        throw new Error("No provider found for the specified medium");
    }
    
    // 2. Provider (strategy) executes send
    return await provider.send(notification);
  }
}


export default new communicationService();