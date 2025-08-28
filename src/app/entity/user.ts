import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
} from "typeorm";
import { logger } from "../utils/logger";


@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique: true})
    phoneNumber?: string;

    @Column({ unique: true})
    email?: string;

    @Column()
    pin!: string;

    @Column({default: false})
    isVerified!: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @BeforeInsert()
        setCreatedAt() {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    
        @BeforeUpdate()
        setUpdatedAt() {
            this.updatedAt = new Date();
        }
    
        @AfterInsert()
        logInsert() {
            logger.info(`Notification with ID ${this.id} has been inserted.`);
        }
    
        @AfterUpdate()
        logUpdate() {
            logger.info(`Notification with ID ${this.id} has been updated.`);
        }
}
