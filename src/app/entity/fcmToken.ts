import { PersistEntity } from "./PersistEntity";
import { Entity , Column } from "typeorm";

@Entity("fcm_token")
export class FcmToken extends PersistEntity{
    @Column()
    token!:string;

    @Column({
        unique: true
    })
    userId!:string;

    protected getPrefix(): string {
        return "ft";
    }
}