import { Medium , Status } from "../../enums/notificationEnum";

export class notificationDTO {
  medium: Medium;
  to?: string;
  bodyText?: string;
  attachments?: string[];
  status?: Status;

  constructor(data: {
    medium: Medium;
    to?: string;
    bodyText?: string;
    attachments?: string[];
    status?: Status;
  }) {
    this.medium = data.medium;
    this.to = data.to;
    this.bodyText = data.bodyText;
    this.attachments = data.attachments;
    this.status = data.status;
  }

  toJSON(): {
    medium: Medium;
    to?: string;
    status?: Status;
    bodyText?: string;
    attachments?: string[];
  } {
    return {
      medium: this.medium,
      to: this.to,
      bodyText: this.bodyText,
      attachments: this.attachments,
      status: this.status
    };
  }
}