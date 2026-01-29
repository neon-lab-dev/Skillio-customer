export interface TConsumer{
    subscribe():Promise<void>
    disconnect(): Promise<void>
}