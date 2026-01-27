import { kafkaConfig } from "../../config/kafkaConfig";
import kafka from "node-rdkafka"

class ProducerConfig{
    private kafkaProducer:kafka.Producer;

    constructor(){
        this.kafkaProducer= new kafka.Producer({
                'metadata.broker.list': kafkaConfig.brokers,
                'dr_cb': true,
        })
    }

    public getProducer=(): kafka.Producer=>{
        return this.kafkaProducer;
    }
}

export default new ProducerConfig()