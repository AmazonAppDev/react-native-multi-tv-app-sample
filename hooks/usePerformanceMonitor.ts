/**
 * Performance monitoring hook for watchlist operations
 * Tracks render times, memory usage, and operation performance
 */

import { useCallback, useRef, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  operationTime: number;
  memoryUsage: number;
}

interface PerformanceMonitorOptions {
  enableLogging?: boolean;
  trackMemory?: boolean;
  sampleRate?: number; // 0-1, percentage of operations to track
}

export const usePerformanceMonitor = (
  componentName: string,
  options: PerformanceMonitorOptions = {}
) => {
  const {
    enableLogging = __DEV__,
    trackMemory = false,
    sampleRate = 0.1,
  } = options;

  const renderStartTime = useRef<number>(0);
  const operationStartTime = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  // Track component render start
  const startRenderTracking = useCallback(() => {
    if (Math.random() > sampleRate) return;
    renderStartTime.current = performance.now();
  }, [sampleRate]);

  // Track component render end
  const endRenderTracking = useCallback(() => {
    if (renderStartTime.current === 0) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    renderStartTime.current = 0;

    if (enableLogging && renderTime > 16) { // Log slow renders (>16ms)
      console.warn(`[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }

    return renderTime;
  }, [componentName, enableLogging]);

  // Track async operation start
  const startOperationTracking = useCallback((operationName: string) => {
    if (Math.random() > sampleRate) return () => {};
    
    operationStartTime.current = performance.now();
    
    return () => {
      const operationTime = performance.now() - operationStartTime.current;
      operationStartTime.current = 0;

      if (enableLogging && operationTime > 100) { // Log slow operations (>100ms)
        console.warn(`[Performance] ${componentName}.${operationName} slow operation: ${operationTime.toFixed(2)}ms`);
      }

      return operationTime;
    };
  }, [componentName, enableLogging, sampleRate]);

  // Get memory usage (if supported)
  const getMemoryUsage = useCallback(() => {
    if (!trackMemory) return 0;
    
    // @ts-ignore - performance.memory is not in all environments
    if (typeof performance !== 'undefined' && performance.memory) {
      // @ts-ignore
      return performance.memory.usedJSHeapSize;
    }
    
    return 0;
  }, [trackMemory]);

  // Log performance summary
  const logPerformanceSummary = useCallback(() => {
    if (!enableLogging || metricsRef.current.length === 0) return;

    const metrics = metricsRef.current;
    const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
    const avgOperationTime = metrics.reduce((sum, m) => sum + m.operationTime, 0) / metrics.length;
    const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));
    const maxOperationTime = Math.max(...metrics.map(m => m.operationTime));

    console.log(`[Performance Summary] ${componentName}:`, {
      samples: metrics.length,
      avgRenderTime: avgRenderTime.toFixed(2) + 'ms',
      maxRenderTime: maxRenderTime.toFixed(2) + 'ms',
      avgOperationTime: avgOperationTime.toFixed(2) + 'ms',
      maxOperationTime: maxOperationTime.toFixed(2) + 'ms',
    });
  }, [componentName, enableLogging]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      logPerformanceSummary();
    };
  }, [logPerformanceSummary]);

  return {
    startRenderTracking,
    endRenderTracking,
    startOperationTracking,
    getMemoryUsage,
    logPerformanceSummary,
  };
};

// Hook for tracking watchlist-specific performance
export const useWatchlistPerformance = () => {
  const monitor = usePerformanceMonitor('Watchlist', {
    enableLogging: __DEV__,
    trackMemory: true,
    sampleRate: 0.2, // Track 20% of operations
  });

  const trackAddOperation = useCallback(() => {
    return monitor.startOperationTracking('addToWatchlist');
  }, [monitor]);

  const trackRemoveOperation = useCallback(() => {
    return monitor.startOperationTracking('removeFromWatchlist');
  }, [monitor]);

  const trackLoadOperation = useCallback(() => {
    return monitor.startOperationTracking('loadWatchlist');
  }, [monitor]);

  const trackRenderPerformance = useCallback(() => {
    monitor.startRenderTracking();
    return monitor.endRenderTracking;
  }, [monitor]);

  return {
    trackAddOperation,
    trackRemoveOperation,
    trackLoadOperation,
    trackRenderPerformance,
    getMemoryUsage: monitor.getMemoryUsage,
    logSummary: monitor.logPerformanceSummary,
  };
};

export default usePerformanceMonitor;