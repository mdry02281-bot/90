import { performance } from 'perf_hooks';
import { logger, logApiRequest, logApiResponse } from '../utils/enhancedLogger';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
  userId?: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

class APMMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 requests

  startRequest(method: string, endpoint: string, userId?: string): number {
    const startTime = performance.now();
    logApiRequest(method, endpoint, userId);
    return startTime;
  }

  endRequest(
    startTime: number,
    method: string,
    endpoint: string,
    statusCode: number,
    userId?: string
  ): void {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const metric: PerformanceMetrics = {
      endpoint,
      method,
      responseTime,
      statusCode,
      timestamp: new Date().toISOString(),
      userId,
      memoryUsage: process.memoryUsage(),
    };

    this.metrics.push(metric);
    
    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    logApiResponse(method, endpoint, statusCode, userId);

    // Log performance warnings
    if (responseTime > 5000) {
      logger.warn('Slow API Response', {
        endpoint,
        method,
        responseTime,
        statusCode,
        userId,
        threshold: 5000,
      });
    }

    if (responseTime > 10000) {
      logger.error('Very Slow API Response', {
        endpoint,
        method,
        responseTime,
        statusCode,
        userId,
        threshold: 10000,
      });
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageResponseTime(endpoint?: string): number {
    const filteredMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const totalTime = filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    return totalTime / filteredMetrics.length;
  }

  getErrorRate(endpoint?: string): number {
    const filteredMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const errorCount = filteredMetrics.filter(m => m.statusCode >= 400).length;
    return errorCount / filteredMetrics.length;
  }

  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    averageResponseTime: number;
    errorRate: number;
    totalRequests: number;
  } {
    const avgResponseTime = this.getAverageResponseTime();
    const errorRate = this.getErrorRate();
    const totalRequests = this.metrics.length;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (avgResponseTime > 2000 || errorRate > 0.1) {
      status = 'warning';
    }

    if (avgResponseTime > 5000 || errorRate > 0.2) {
      status = 'critical';
    }

    return {
      status,
      averageResponseTime: avgResponseTime,
      errorRate,
      totalRequests,
    };
  }

  // Export metrics for external monitoring systems
  exportMetrics(): any {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        totalRequests: this.metrics.length,
        averageResponseTime: this.getAverageResponseTime(),
        errorRate: this.getErrorRate(),
        healthStatus: this.getHealthStatus(),
      },
    };
  }
}

// Global APM instance
export const apmMonitor = new APMMonitor();

// Express middleware for automatic performance monitoring
export const apmMiddleware = (req: any, res: any, next: any) => {
  const startTime = apmMonitor.startRequest(req.method, req.path, req.user?.id);

  res.on('finish', () => {
    apmMonitor.endRequest(
      startTime,
      req.method,
      req.path,
      res.statusCode,
      req.user?.id
    );
  });

  next();
};

// Health check endpoint
export const healthCheck = (req: any, res: any) => {
  const health = apmMonitor.getHealthStatus();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: health.status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    },
    performance: {
      averageResponseTime: health.averageResponseTime,
      errorRate: health.errorRate,
      totalRequests: health.totalRequests,
    },
    database: {
      connected: true, // This should check actual DB connection
    },
  });
};

// Metrics endpoint for monitoring systems
export const metricsEndpoint = (req: any, res: any) => {
  res.json(apmMonitor.exportMetrics());
};
