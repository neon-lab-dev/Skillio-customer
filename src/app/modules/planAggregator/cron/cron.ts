import cron from "node-cron";
import { triggeredTime } from "./cron.constant";

class Cron{
    public planAggregatorCron(){
        cron.schedule(triggeredTime , function(){
            
        });
    }
}