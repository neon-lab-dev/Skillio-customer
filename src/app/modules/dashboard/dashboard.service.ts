import { Loggable } from "@neon-lab-dev/platform";
import registrationServices from "../registration/registration.services";
import { userSubscriptionService } from "../userSubscription/service/service.user.subscription";
import { DashboardResponseDto } from "./models/response/dashboard.response.dto";
import servicePostProxy from "../../service/post-proxy/service.post-proxy";

class DashboardService {

    @Loggable()
    public async fetchDashboardStatistics():Promise<DashboardResponseDto>{
        const profileCount= await registrationServices.getProfileCount();
        const subscriptions= await userSubscriptionService.fetchActiveSubscriptionsCount();
        const postCount= await servicePostProxy.fetchAllMediaCount();

        return {
            totalUsers: profileCount.totalCount,
            totalIndividuals: profileCount.individualsCount.total,
            totalPosts: postCount.count,
            totalGroups: profileCount.groupCount.total,
            totalSkilled: profileCount.totalSkilled,
            totalProfessional: profileCount.totalProfessional,
            pendingVerifications: profileCount.pendingVerifications,
            activeSubscriptions: subscriptions
        }
    }

}

export default new DashboardService();