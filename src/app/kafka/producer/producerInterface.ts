export interface TProducer{
    connect():Promise<void>;
    produce(topic: string, message:object , key?:string):void;
    disconnect(): Promise<void>
}