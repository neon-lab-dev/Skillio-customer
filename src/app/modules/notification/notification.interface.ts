import { Medium , Status } from "../../entity/notification";
import { Attachment } from "../../entity/notification";
import { NotificationBody } from "../../entity/notification";


export interface TNotification {
  medium: Medium;
  phone?: string;
  email?: string;
  deviceToken?: string;
  bodyText: NotificationBody;
  attachments?: Attachment[];
  status: Status;
}
