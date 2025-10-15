"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerLogging = void 0;
const logger_1 = require("./logger");
const controllerLogging = (controllerName, handler) => {
    return async (req, res, next) => {
        const start = process.hrtime();
        // Log controller start with sanitized input
        const sanitizedInput = { ...req.body, params: req.params, query: req.query };
        if (sanitizedInput.pin)
            delete sanitizedInput.pin;
        if (sanitizedInput.password)
            delete sanitizedInput.password;
        if (sanitizedInput.confirmPassword)
            delete sanitizedInput.confirmPassword;
        logger_1.logController.start(controllerName, sanitizedInput);
        try {
            await handler(req, res, next);
            const diff = process.hrtime(start);
            const timeMs = diff[0] * 1000 + diff[1] / 1e6;
            logger_1.logController.success(controllerName, res.statusCode, `${timeMs.toFixed(2)}ms`);
        }
        catch (err) {
            const diff = process.hrtime(start);
            const timeMs = diff[0] * 1000 + diff[1] / 1e6;
            logger_1.logController.error(controllerName, err, `${timeMs.toFixed(2)}ms`);
            next(err);
        }
    };
};
exports.controllerLogging = controllerLogging;
