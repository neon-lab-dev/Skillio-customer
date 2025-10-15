"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logProxy = exports.logService = exports.logController = exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    }
};
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((info) => {
    const { timestamp, level, message, layer, controller, service, status, responseTime, error, input, ...meta } = info;
    let log = `${timestamp} [${level}]`;
    if (layer)
        log += ` [${layer}]`;
    if (controller)
        log += ` [${controller}]`;
    if (service)
        log += ` [${service}]`;
    log += `: ${message}`;
    if (status)
        log += ` | Status: ${status}`;
    if (responseTime)
        log += ` | Time: ${responseTime}`;
    if (error)
        log += ` | Error: ${error}`;
    if (input && process.env.NODE_ENV !== 'production') {
        log += `\n  Input: ${JSON.stringify(input, null, 2)}`;
    }
    if (Object.keys(meta).length > 0) {
        log += `\n  Meta: ${JSON.stringify(meta, null, 2)}`;
    }
    return log;
}));
const logsDir = path_1.default.join(process.cwd(), 'logs');
exports.logger = winston_1.default.createLogger({
    levels: customLevels.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'info.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Error logs
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'warn.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 10,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'http.log'),
            level: 'http',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'exceptions.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'rejections.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
        level: 'debug',
    }));
}
if (process.env.NODE_ENV === 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        level: 'error', // Only errors to console in production
    }));
}
exports.stream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
exports.logController = {
    start: (controllerName, input) => {
        exports.logger.info(`${controllerName} started`, {
            layer: 'controller',
            controller: controllerName,
            input: process.env.NODE_ENV !== 'production' ? input : undefined,
        });
    },
    success: (controllerName, status, responseTime) => {
        exports.logger.info(`${controllerName} completed successfully`, {
            layer: 'controller',
            controller: controllerName,
            status,
            responseTime,
        });
    },
    error: (controllerName, error, responseTime) => {
        exports.logger.error(`${controllerName} failed`, {
            layer: 'controller',
            controller: controllerName,
            error: error.message,
            stack: error.stack,
            responseTime,
        });
    },
};
exports.logService = {
    start: (serviceName, method) => {
        exports.logger.info(`${serviceName}.${method} started`, {
            layer: 'service',
            service: serviceName,
            method
        });
    },
    success: (serviceName, method, responseTime) => {
        exports.logger.info(`${serviceName}.${method} completed successfully`, {
            layer: 'service',
            service: serviceName,
            method,
            responseTime,
        });
    },
    error: (serviceName, method, error, responseTime) => {
        exports.logger.error(`${serviceName}.${method} failed`, {
            layer: 'service',
            service: serviceName,
            method,
            error: error.message,
            stack: error.stack,
            responseTime,
        });
    },
};
exports.logProxy = {
    start: (proxyName, method) => {
        exports.logger.info(`${proxyName}.${method} started`, {
            layer: 'proxy',
            proxy: proxyName,
            method
        });
    },
    success: (proxyName, method, responseTime) => {
        exports.logger.info(`${proxyName}.${method} completed successfully`, {
            layer: 'proxy',
            proxy: proxyName,
            method,
            responseTime,
        });
    },
    error: (proxyName, method, error, responseTime) => {
        exports.logger.error(`${proxyName}.${method} failed`, {
            layer: 'proxy',
            proxy: proxyName,
            method,
            error: error.message,
            stack: error.stack,
            responseTime,
        });
    }
};
exports.default = exports.logger;
