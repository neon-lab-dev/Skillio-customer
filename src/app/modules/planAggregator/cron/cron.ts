import cron from "node-cron";
import { getCronConfig } from "./config/cron.config";
import planAggregatorService from "../planAggregator.service";

export class Cron{
    public async planAggregatorCron(){
        const cronConfig=  await getCronConfig();


        cron.schedule(cronConfig.triggerTime , async function (){
            const planAggregators= await planAggregatorService.fetchAll();

            await Promise.all(planAggregators.map(async (val)=>{
                await planAggregatorService.expirePlanAggregatorUserSubscriptions(val);
            }))
        });
    }
}