import { Medium, Status, NotificationBody, Attachment } from "../../entity/notification"

export class notificationDTO {
  medium: Medium;
  phone?: string;
  email?: string;
  deviceToken?: string;
  bodyText?: NotificationBody;
  attachments?: Attachment[];
  status?: Status;

  constructor(data: {
    medium: Medium;
    phone?: string;
    email?: string;
    deviceToken?: string;
    bodyText?: NotificationBody;
    attachments?: Attachment[];
    status?: Status;
  }) {
    this.medium = data.medium;
    this.phone = data.phone;
    this.email = data.email;
    this.deviceToken = data.deviceToken;
    this.bodyText = data.bodyText;
    this.attachments = data.attachments;
    this.status = data.status;
  }

  toJSON(): {
    medium: Medium;
    phone?: string;
    email?: string;
    deviceToken?: string;
    bodyText?: NotificationBody;
    attachments?: Attachment[];
    status?: Status;
  } {
    return {
      medium: this.medium,
      phone: this.phone,
      email: this.email,
      deviceToken: this.deviceToken,
      bodyText: this.bodyText,
      attachments: this.attachments,
      status: this.status
    };
  }
}