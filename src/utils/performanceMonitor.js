/**
 * Performance Monitoring & Optimization Utilities
 * Real-time performance metrics tracking
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  /**
   * Initialize Web Vitals monitoring
   */
  initWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = {
          value: lastEntry.renderTime || lastEntry.loadTime,
          timestamp: new Date(),
        };
        this.logMetric('LCP', this.metrics.lcp.value);
      });

      try {
        paintObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this.metrics.cls = {
              value: (this.metrics.cls?.value || 0) + entry.value,
              timestamp: new Date(),
            };
            this.logMetric('CLS', this.metrics.cls.value);
          }
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            timestamp: new Date(),
          };
          this.logMetric('FID', this.metrics.fid.value);
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }

    // Time to First Byte (TTFB)
    if (window.performance && window.performance.timing) {
      const ttfb = window.performance.timing.responseStart - window.performance.timing.navigationStart;
      this.metrics.ttfb = {
        value: ttfb,
        timestamp: new Date(),
      };
      this.logMetric('TTFB', ttfb);
    }

    // First Contentful Paint (FCP)
    const perfEntries = performance.getEntriesByType('paint');
    perfEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.metrics.fcp = {
          value: entry.startTime,
          timestamp: new Date(),
        };
        this.logMetric('FCP', entry.startTime);
      }
    });
  }

  /**
   * Measure image load performance
   */
  measureImageLoad(imageName) {
    return {
      startMeasure: (imageName) => {
        performance.mark(`image-start-${imageName}`);
      },
      endMeasure: (imageName) => {
        performance.mark(`image-end-${imageName}`);
        performance.measure(`image-load-${imageName}`, `image-start-${imageName}`, `image-end-${imageName}`);
        const measure = performance.getEntriesByName(`image-load-${imageName}`)[0];
        if (measure) {
          this.logMetric(`Image Load - ${imageName}`, measure.duration);
        }
      },
    };
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      navigationTiming: this.getNavigationTiming(),
      resourceTiming: this.getResourceTiming(),
    };
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming() {
    if (!window.performance || !window.performance.timing) return null;

    const timing = window.performance.timing;
    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.navigationStart,
      download: timing.responseEnd - timing.responseStart,
      domInteractive: timing.domInteractive - timing.navigationStart,
      domComplete: timing.domComplete - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
    };
  }

  /**
   * Get resource timing summary
   */
  getResourceTiming() {
    if (!window.performance || !window.performance.getEntriesByType) return null;

    const resources = window.performance.getEntriesByType('resource');
    const summary = {
      total: resources.length,
      totalDuration: 0,
      byType: {},
    };

    resources.forEach((resource) => {
      summary.totalDuration += resource.duration;
      const type = resource.initiatorType;
      if (!summary.byType[type]) {
        summary.byType[type] = { count: 0, duration: 0 };
      }
      summary.byType[type].count++;
      summary.byType[type].duration += resource.duration;
    });

    return summary;
  }

  /**
   * Log metric to console
   */
  logMetric(name, value) {
    const unit = name.includes('Paint') || name.includes('LCP') || name.includes('Load') ? 'ms' : '';
    console.log(`📊 ${name}: ${value.toFixed(2)}${unit}`);
  }

  /**
   * Send metrics to analytics service
   */
  sendMetrics(endpoint) {
    const metrics = this.getMetrics();
    if (!navigator.sendBeacon) {
      console.warn('sendBeacon not supported');
      return;
    }

    navigator.sendBeacon(endpoint, JSON.stringify(metrics));
  }

  /**
   * Clean up observers
   */
  dispose() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * Print performance report
   */
  printReport() {
    console.group('📈 Performance Report');
    console.table(this.getMetrics());
    console.table(this.getNavigationTiming());
    console.table(this.getResourceTiming());
    console.groupEnd();
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.performanceMonitor = new PerformanceMonitor();
  
  // Auto-initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.performanceMonitor.initWebVitals();
    });
  } else {
    window.performanceMonitor.initWebVitals();
  }
}

export default PerformanceMonitor;
