import kafka from "node-rdkafka";
import { TProducer } from "./producerInterface";
import producerConfig from "./producerConfig";
import logger from "../../utils/logger";
import AppError from "../../errors/appError";

export class Producer implements TProducer {
  private producer: kafka.Producer;


  constructor() {
    this.producer = producerConfig.getProducer()
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
    this.producer.connect()
    this.producer.setPollInterval(100);
    this.producer
      .on('ready', () => {
        resolve();
      })
      .on('delivery-report' , (err , report)=>{
        if(err){
          logger.error(`producer error: ${err}`)
        }else{
          logger.info(`report: ${JSON.stringify(report)}`)
        }
      })
      .on('event.error', (err) => {
        logger.error(`producer error: ${err}`)
        throw new AppError(503 , `producer error: ${err.message}`)
      });
  });
}

  public produce(topic: string, message: object, key?: string): void {
    this.producer.produce(
      topic,
      null,
      Buffer.from(JSON.stringify(message)),
      key,
      Date.now()
    );
  }

  public async disconnect(): Promise<void> {
    this.producer.disconnect();
  }
}
