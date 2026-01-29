import kafka from "node-rdkafka"
import { Events } from "../events";
import { KafkaError } from "@neon-lab-dev/platform";
import { TConsumer } from "./consumerInterface";
import consumerConfig from "./consumerConfig";
import notificationServices from "../../modules/notification/services/notification.services";
import { Medium } from "../../modules/notification/enums/notificationEnum";


export class NotificationConsumer implements TConsumer{
    private consumer: kafka.KafkaConsumer;
    
     
    constructor(){
        this.consumer= consumerConfig.getConsumer()
    }
    
    public async subscribe(): Promise<void> {
        this.consumer.connect()
        this.consumer
        .on('ready', () => {
            const notificationTopic= Events.NOTIFICATION;
            this.consumer.subscribe([notificationTopic])
            this.consumer.consume()
        })
        .on('data' , async function (data){
            const notification= data.value && JSON.parse(data.value.toString())
            const { to, ...rest } = notification;
            const entity= {
                medium: Medium.NOTIFICATION,
                to: to,
                bodyText: JSON.stringify({
                    ...rest
                })
            }
            await notificationServices.createNotification(
                entity
            )
        })
        .on('event.error', (err) => {
            throw new KafkaError(`producer error ${err.message}`)
        });
    }

    public async disconnect(): Promise<void> {
        this.consumer.disconnect()
    }

}