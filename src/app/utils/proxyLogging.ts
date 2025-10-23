import { logProxy } from './logger';

export const proxyLogging = <T extends any[], R>(
  proxyName: string,
  method: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const start = process.hrtime();
    
    
    logProxy.start(proxyName, method);

    try {
      const result = await fn(...args);
      
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logProxy.success(proxyName, method, `${timeMs.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logProxy.error(proxyName, method, error as Error, `${timeMs.toFixed(2)}ms`);
      
      throw error;
    }
  };
};