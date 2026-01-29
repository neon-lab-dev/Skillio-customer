import { AppRequest } from "@neon-lab-dev/platform";

export class NotificationDto implements AppRequest{
    bodyText!: string | undefined;
}