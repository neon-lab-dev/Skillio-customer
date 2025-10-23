import { logService } from "./logger";

export const serviceLogging = <T extends any[], R>(
  serviceName: string,
  method: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const start = process.hrtime();
    
    logService.start(serviceName, method);

    try {
      const result = await fn(...args);
      
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logService.success(serviceName, method, `${timeMs.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logService.error(serviceName, method, error as Error, `${timeMs.toFixed(2)}ms`);
      
      throw error;
    }
  };
};