import { Status } from "./enums/chatEnum";
import { content } from "./interface/chat.interface";

export class ChaDTO{
    recipientId!: string;
    content?: content;
    fcmRegistrationToken?: string;

    constructor(data:{
        recipientId: string;
        content?: content;
        fcmRegistrationToken?: string;  
    }){
        this.recipientId= data.recipientId;
        this.content = typeof data.content === 'string' 
            ? JSON.parse(data.content) 
            : data.content;
        this.fcmRegistrationToken= data.fcmRegistrationToken;
    }

    toJSON():{
        recipientId: string;
        content?: content;
        fcmRegistrationToken?: string;
    }{
        return{
            recipientId: this.recipientId,
            content: this.content,
            fcmRegistrationToken: this.fcmRegistrationToken
        }
    }
}

export class GetChatDTO{
    senderId!: string;
    recipientId!: string;
    content:content;
    status: Status;
    readAt: Date;
    isDeleted: boolean;

    constructor(data:{
        senderId: string;
        recipientId: string;
        content: content;
        status: Status;
        readAt: Date;
        isDeleted: boolean;
    }){
        this.senderId= data.senderId;
        this.recipientId= data.recipientId;
        this.content= data.content;
        this.status= data.status;
        this.readAt= data.readAt;
        this.isDeleted= data.isDeleted;
    }

    toJSON():{
        senderId: string;
        recipientId: string;
        content: content;
        status: Status;
        readAt: Date;
        isDeleted: boolean;
    }{
        return{
            senderId: this.senderId,
            recipientId: this.recipientId,
            content: this.content,
            status: this.status,
            readAt: this.readAt,
            isDeleted: this.isDeleted
        }
    }
}

export class MessagesDTO{
    recipientId!: string;
    before!: Date;

    constructor(data:{
        recipientId: string;
        before: Date;
    }){
        this.recipientId= data.recipientId;
        this.before= typeof data.before=== 'string' ? new Date(data.before) : data.before;
    }

    toJSON():{
        recipientId: string;
        before: Date;
    }{
        return{
            recipientId: this.recipientId,
            before: this.before
        }
    }
}