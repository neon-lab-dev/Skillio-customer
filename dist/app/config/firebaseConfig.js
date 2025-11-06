"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessaging = exports.initializeFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fcmServiceAccountConfig_1 = require("../modules/chat/config/fcmServiceAccountConfig");
const logger_1 = __importDefault(require("../utils/logger"));
let messaging;
let isInitialized = false;
const initializeFirebase = () => {
    if (isInitialized) {
        logger_1.default.info('Firebase already initialized');
        return;
    }
    try {
        const fcmServiceAccountConfig = (0, fcmServiceAccountConfig_1.getFcmServiceAccountConfig)();
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(fcmServiceAccountConfig)
        });
        messaging = firebase_admin_1.default.messaging();
        isInitialized = true;
    }
    catch (error) {
        logger_1.default.error(' Failed to initialize Firebase:', error);
    }
};
exports.initializeFirebase = initializeFirebase;
const getMessaging = () => {
    return messaging;
};
exports.getMessaging = getMessaging;
