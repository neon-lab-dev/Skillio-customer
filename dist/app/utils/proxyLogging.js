"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyLogging = void 0;
const logger_1 = require("./logger");
const proxyLogging = (proxyName, method, fn) => {
    return async (...args) => {
        const start = process.hrtime();
        logger_1.logProxy.start(proxyName, method);
        try {
            const result = await fn(...args);
            const diff = process.hrtime(start);
            const timeMs = diff[0] * 1000 + diff[1] / 1e6;
            logger_1.logProxy.success(proxyName, method, `${timeMs.toFixed(2)}ms`);
            return result;
        }
        catch (error) {
            const diff = process.hrtime(start);
            const timeMs = diff[0] * 1000 + diff[1] / 1e6;
            logger_1.logProxy.error(proxyName, method, error, `${timeMs.toFixed(2)}ms`);
            throw error;
        }
    };
};
exports.proxyLogging = proxyLogging;
