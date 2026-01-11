import { idGenerator } from "@neon-lab-dev/platform";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, PrimaryColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn} from "typeorm";


/**
 * 
 * Duplicate of BaseEntity.
 */

export abstract class PersistEntity extends TypeOrmBaseEntity {

    constructor(){
        super();
    }

    @PrimaryColumn(
        {
            type: "varchar",
            length: 50,
        }
    )
    id!: string;

    @Column(
        {
            type: "boolean",
            nullable: false,
            default: false
        }
    )
    deleted!: boolean;

    @CreateDateColumn(
        {
            name: "created_at",
            type: "timestamp",
            nullable: false
        }
    )
    createdAt!: Date;

    @UpdateDateColumn(
        {
            name: "updated_at",
            type: "timestamp",
            nullable: false
        }
    )
    updatedAt!: Date;

    protected abstract getPrefix() : string;

    @BeforeInsert()
    async beforeInsert(){
        if (!this.id) {
            this.id = idGenerator.generate(this.getPrefix());
        }
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    async beforeUpdate(){
        this.updatedAt = new Date();
    }

}