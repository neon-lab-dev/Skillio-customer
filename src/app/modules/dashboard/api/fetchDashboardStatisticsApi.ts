import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { fetchDashboardStatisticsRequest } from "../models/request/dashboard.request.dto";
import { AppResponse } from "@neon-lab-dev/platform";
import dashboardService from "../dashboard.service";

export class FetchDashboardStatisticsApi implements Api<fetchDashboardStatisticsRequest , AppResponse>{
    async preprocess(req: fetchDashboardStatisticsRequest):  Promise<void> | never {
        
    }

    async process(req: fetchDashboardStatisticsRequest): Promise<AppResponse> {
        const res= await dashboardService.fetchDashboardStatistics();

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}