import { AppResponseData } from "@neon-lab-dev/platform";

export class DashboardResponseDto implements AppResponseData{
    totalUsers!: number;
    totalPosts!: number;
    totalIndividuals!: number;
    totalGroups!: number;
    totalSkilled!: number;
    totalProfessional!: number;
    pendingVerifications!: number;
    activeSubscriptions!: number;
}