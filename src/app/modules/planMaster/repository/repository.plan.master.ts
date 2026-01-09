import { BaseRepository } from "@neon-lab-dev/platform";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { AppDataSource } from "../../../db/dataSource";

export class PlanMasterRepository extends BaseRepository<PlanMasterEntity> {

    constructor(){
        super(AppDataSource, PlanMasterEntity);
    }

}