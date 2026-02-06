export interface CallProviderInterface{
    getToken(identity: string): Promise<any>
}