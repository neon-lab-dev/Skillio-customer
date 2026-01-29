import { NotificationConsumer } from "./notificationConsumer"

export class Consumer{

    private notificationConsumer: NotificationConsumer= new NotificationConsumer()

    public loadConsumers=async()=>{
        await this.notificationConsumer.subscribe()
    }
}
