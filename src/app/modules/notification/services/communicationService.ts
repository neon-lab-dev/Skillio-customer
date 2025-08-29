import { Notification } from "../../../entity/notification";
import { ProviderResult } from "../../../providers/NotificationProvider";
import { ProviderFactory } from "../../../providers/ProviderFactory";


class communicationService {
  private providerFactory: ProviderFactory;

  constructor() {
    this.providerFactory = new ProviderFactory();
  }

  async sendNotification(notification: Partial<Notification>): Promise<ProviderResult> {
    // 1. Factory resolves correct provider (SMS, EMAIL, PUSH)
    const provider = this.providerFactory.resolve(notification);


    if(!provider){
        throw new Error("No provider found for the specified medium");
    }
    
    // 2. Provider (strategy) executes send
    return await provider.send(notification);
  }
}


export default new communicationService();