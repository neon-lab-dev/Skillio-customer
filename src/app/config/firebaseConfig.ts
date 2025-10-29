import admin from 'firebase-admin';
import { getFcmServiceAccountConfig } from '../modules/chat/config/fcmServiceAccountConfig';
import logger from '../utils/logger';

let messaging: admin.messaging.Messaging | undefined;
let isInitialized = false;

export const initializeFirebase = ()=> {
  if (isInitialized) {
    logger.info('Firebase already initialized');
    return;
  }

  try {
    const fcmServiceAccountConfig = getFcmServiceAccountConfig();

    admin.initializeApp({
      credential: admin.credential.cert(fcmServiceAccountConfig as admin.ServiceAccount)
    });

     messaging = admin.messaging();
    isInitialized = true;

  } catch (error) {
    logger.error(' Failed to initialize Firebase:', error);
  }
};


export const getMessaging = ()=> {
    return messaging;
};