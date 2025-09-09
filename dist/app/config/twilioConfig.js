"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwilioConfig = exports.laodTwilioConfig = void 0;
let twilioConfig;
const laodTwilioConfig = async (configs) => {
    twilioConfig = configs.find(config => config.medium === "SMS");
};
exports.laodTwilioConfig = laodTwilioConfig;
const getTwilioConfig = async () => {
    return twilioConfig;
};
exports.getTwilioConfig = getTwilioConfig;
