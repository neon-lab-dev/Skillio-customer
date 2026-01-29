import { kafkaConfig } from "../../config/kafkaConfig";
import kafka from "node-rdkafka"

class ConsumerConfig{
    private consumer: kafka.KafkaConsumer;

    constructor(){
        this.consumer= new kafka.KafkaConsumer({
            'metadata.broker.list': kafkaConfig.brokers,
            'group.id': kafkaConfig.groupId,
        } , {})
    }

    public getConsumer=():kafka.KafkaConsumer=>{
        return this.consumer
    }
}

export default new ConsumerConfig()