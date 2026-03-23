export interface content{
    title?:string
    text?: string;
    postId?: string;
    fileUrl?: string;
    callerId?:string;
}

export interface TMessage{
    recipientId: string;
    content?:content;
    fcmRegistrationToken?: string;
}

export interface TFcmServiceAccountConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}
