"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwilioConfig = exports.loadTwilioConfig = void 0;
let twilioConfig;
const loadTwilioConfig = async (configs) => {
    twilioConfig = configs.find(config => config.medium === "SMS");
};
exports.loadTwilioConfig = loadTwilioConfig;
const getTwilioConfig = async () => {
    return twilioConfig;
};
exports.getTwilioConfig = getTwilioConfig;
