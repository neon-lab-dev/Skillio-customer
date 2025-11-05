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
    id!: string;
    senderId!: string;
    recipientId!: string;
    content:content;
    status: Status;
    readAt: Date;
    isDeleted: boolean;
    createdAt!: Date;

    constructor(data:{
        id: string;
        senderId: string;
        recipientId: string;
        content: content;
        status: Status;
        readAt: Date;
        isDeleted: boolean;
        createdAt: Date;
    }){
        this.id= data.id;
        this.senderId= data.senderId;
        this.recipientId= data.recipientId;
        this.content= data.content;
        this.status= data.status;
        this.readAt= data.readAt;
        this.isDeleted= data.isDeleted;
        this.createdAt= data.createdAt;
    }

    toJSON():{
        id: string;
        senderId: string;
        recipientId: string;
        content: content;
        status: Status;
        readAt: Date;
        isDeleted: boolean;
        createdAt: Date;
    }{
        return{
            id: this.id,
            senderId: this.senderId,
            recipientId: this.recipientId,
            content: this.content,
            status: this.status,
            readAt: this.readAt,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt
        }
    }
}