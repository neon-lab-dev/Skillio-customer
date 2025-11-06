"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSinglePushNotification = void 0;
const logger_1 = __importDefault(require("./logger"));
const registrationRepository_1 = __importDefault(require("../repository/registrationRepository"));
const firebaseConfig_1 = require("../config/firebaseConfig");
const sendSinglePushNotification = async (senderId, content, registrationToken) => {
    const profile = await registrationRepository_1.default.findProfileById(senderId);
    const message = {
        data: {
            title: `New message from ${profile?.firstName} ${profile?.lastName}`,
            body: content.text || "You have received a new message.",
        },
        token: registrationToken
    };
    try {
        (0, firebaseConfig_1.initializeFirebase)();
        const messaging = (0, firebaseConfig_1.getMessaging)();
        if (messaging) {
            messaging.send(message).then((res) => {
                logger_1.default.info(`Push notification sent successfully: ${res}`);
            });
        }
    }
    catch (error) {
        logger_1.default.error("Error sending push notification", error);
    }
};
exports.sendSinglePushNotification = sendSinglePushNotification;
