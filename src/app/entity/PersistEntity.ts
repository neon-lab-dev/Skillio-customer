import { AutoMap } from "@automapper/classes";
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
    @AutoMap()
    id!: string;

    @Column(
        {
            type: "boolean",
            nullable: false,
            default: false
        }
    )
    @AutoMap()
    deleted!: boolean;

    @CreateDateColumn(
        {
            name: "created_at",
            type: "timestamp",
            nullable: false
        }
    )
    @AutoMap()
    createdAt!: Date;

    @UpdateDateColumn(
        {
            name: "updated_at",
            type: "timestamp",
            nullable: false
        }
    )
    @AutoMap()
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