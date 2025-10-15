import winston from "winston";
import path from "path";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  }
};


const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, layer, controller, service, status, responseTime, error, input, ...meta } = info;
    
    let log = `${timestamp} [${level}]`;
    
    if (layer) log += ` [${layer}]`;
    if (controller) log += ` [${controller}]`;
    if (service) log += ` [${service}]`;
    
    log += `: ${message}`;
    
    if (status) log += ` | Status: ${status}`;
    if (responseTime) log += ` | Time: ${responseTime}`;
    if (error) log += ` | Error: ${error}`;
    
    if (input && process.env.NODE_ENV !== 'production') {
      log += `\n  Input: ${JSON.stringify(input, null, 2)}`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\n  Meta: ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

const logsDir = path.join(process.cwd(), 'logs');

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [

    new winston.transports.File({
      filename: path.join(logsDir, 'info.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Error logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,  
    }),
    
    new winston.transports.File({ 
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    
    new winston.transports.File({ 
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug',
  }));
}

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    level: 'error', // Only errors to console in production
  }));
}

export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const logController = {
  start: (controllerName: string, input?: any) => {
    logger.info(`${controllerName} started`, {
      layer: 'controller',
      controller: controllerName,
      input: process.env.NODE_ENV !== 'production' ? input : undefined,
    });
  },
  
  success: (controllerName: string, status: number, responseTime: string) => {
    logger.info(`${controllerName} completed successfully`, {
      layer: 'controller',
      controller: controllerName,
      status,
      responseTime,
    });
  },
  
  error: (controllerName: string, error: Error, responseTime: string) => {
    logger.error(`${controllerName} failed`, {
      layer: 'controller',
      controller: controllerName,
      error: error.message,
      stack: error.stack,
      responseTime,
    });
  },
};

export const logService = {
  start: (serviceName: string, method: string) => {
    logger.info(`${serviceName}.${method} started`, {
      layer: 'service',
      service: serviceName,
      method
    });
  },
  
  success: (serviceName: string, method: string, responseTime: string) => {
    logger.info(`${serviceName}.${method} completed successfully`, {
      layer: 'service',
      service: serviceName,
      method,
      responseTime,
    });
  },
  
  error: (serviceName: string, method: string, error: Error, responseTime: string) => {
    logger.error(`${serviceName}.${method} failed`, {
      layer: 'service',
      service: serviceName,
      method,
      error: error.message,
      stack: error.stack,
      responseTime,
    });
  },
};

export const logProxy = {
  start: (proxyName: string, method: string) => {
    logger.info(`${proxyName}.${method} started`, {
      layer: 'proxy',
      proxy: proxyName,
      method
    });
  }
  ,
  success: (proxyName: string, method: string, responseTime: string) => {
    logger.info(`${proxyName}.${method} completed successfully`, {
      layer: 'proxy',
      proxy: proxyName,
      method,
      responseTime,
    });
  },

  error: (proxyName: string, method: string, error: Error, responseTime: string) => {
    logger.error(`${proxyName}.${method} failed`, {
      layer: 'proxy',
      proxy: proxyName,
      method,
      error: error.message,
      stack: error.stack,
      responseTime,
    });
  }
};

export default logger;