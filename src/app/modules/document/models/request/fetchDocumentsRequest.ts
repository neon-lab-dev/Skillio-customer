import { AppRequest } from "@neon-lab-dev/platform";

export class FetchDocumentsRequest implements AppRequest{
    portfolioId!: string;
}