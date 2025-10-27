import winston from 'winston';

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'promohive' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Enhanced logging functions
export const logApiRequest = (method: string, endpoint: string, userId?: string) => {
  logger.info('API Request', {
    method,
    endpoint,
    userId,
    timestamp: new Date().toISOString(),
    source: 'api'
  });
};

export const logApiResponse = (method: string, endpoint: string, status: number, userId?: string) => {
  const level = status >= 400 ? 'error' : 'info';
  logger[level]('API Response', {
    method,
    endpoint,
    status,
    userId,
    timestamp: new Date().toISOString(),
    source: 'api'
  });
};

export const logDataFetch = (source: 'api' | 'cache', endpoint: string, success: boolean, userId?: string) => {
  const level = success ? 'info' : 'error';
  logger[level]('Data Fetch', {
    source,
    endpoint,
    success,
    userId,
    timestamp: new Date().toISOString(),
    dataSource: source
  });
};

export const logAuthEvent = (event: string, userId?: string, success: boolean = true) => {
  const level = success ? 'info' : 'warn';
  logger[level]('Auth Event', {
    event,
    userId,
    success,
    timestamp: new Date().toISOString(),
    source: 'auth'
  });
};

export const logDatabaseOperation = (operation: string, table: string, success: boolean, userId?: string) => {
  const level = success ? 'info' : 'error';
  logger[level]('Database Operation', {
    operation,
    table,
    success,
    userId,
    timestamp: new Date().toISOString(),
    source: 'database'
  });
};

export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    source: 'error'
  });
};

export { logger };
