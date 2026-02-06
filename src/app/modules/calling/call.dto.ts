import { status } from "./enums/callEnum";

export class GetCallDTO{
    id!:string;
    callerId!:string;
    recipientId!:string;
    callStatus!:status
    startedAt!:Date;
    endedAt?:Date;

    constructor(data:{
        id:string;
        callerId:string;
        recipientId:string;
        callStatus:status;
        startedAt:Date;
        endedAt?:Date;
    }){
        this.id= data.id;
        this.callerId= data.callerId;
        this.recipientId= data.recipientId;
        this.callStatus= data.callStatus;
        this.startedAt= data.startedAt;
        this.endedAt= data.endedAt;
    }

    toJSON():{
        id: string;
        callerId: string;
        recipientId: string;
        callStatus: status
        startedAt: Date;
        endedAt?: Date;
    }{
        return{
            id: this.id,
            callerId: this.callerId,
            recipientId: this.recipientId,
            callStatus: this.callStatus,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
        
        }
    }
}