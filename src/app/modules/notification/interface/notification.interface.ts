import { Medium , Status } from "../enums/notificationEnum";


export interface TNotification {
  medium: Medium;
  to?: string;
  bodyText: string;
  attachments?: string[];
  status: Status;
}
