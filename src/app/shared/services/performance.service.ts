/**
 * @ai-context {
 *   "role": "Shared/Service",
 *   "purpose": "性能監控服務-應用性能指標追蹤",
 *   "constraints": ["Signals優先", "無外部依賴", "極簡實現"],
 *   "dependencies": ["@angular/core"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 * @usage performanceService.metrics(), performanceService.trackEvent('click')
 * @see docs/architecture/shared.md
 */
import { computed, Injectable, signal } from '@angular/core';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'navigation' | 'interaction' | 'resource' | 'custom';
}

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  // 私有狀態 Signals
  private readonly _metrics = signal<PerformanceMetric[]>([]);
  private readonly _isMonitoring = signal(false);

  // 公開只讀狀態
  readonly metrics = this._metrics.asReadonly();
  readonly isMonitoring = this._isMonitoring.asReadonly();

  // 計算屬性
  readonly metricCount = computed(() => this._metrics().length);
  readonly recentMetrics = computed(() =>
    this._metrics().slice(-10).reverse()
  );

  constructor() {
    this.initializeMonitoring();
  }

  // 開始監控
  startMonitoring(): void {
    if (this._isMonitoring()) return;

    this._isMonitoring.set(true);
    this.setupPerformanceObservers();
  }

  // 停止監控
  stopMonitoring(): void {
    this._isMonitoring.set(false);
  }

  // 追蹤自定義事件
  trackEvent(name: string, value: number = 1, category: PerformanceMetric['category'] = 'custom'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      category
    };

    this._metrics.update(metrics => [...metrics, metric]);
  }

  // 獲取性能指標
  getMetrics(category?: PerformanceMetric['category']): PerformanceMetric[] {
    const metrics = this._metrics();
    return category ? metrics.filter(m => m.category === category) : metrics;
  }

  // 清除指標
  clearMetrics(): void {
    this._metrics.set([]);
  }

  private initializeMonitoring(): void {
    // 自動開始監控
    this.startMonitoring();
  }

  private setupPerformanceObservers(): void {
    // 監控導航性能
    if ('PerformanceObserver' in window) {
      try {
        // 監控 LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;

          this.trackEvent('LCP', lastEntry.startTime, 'navigation');
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // 監控 CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.trackEvent('CLS', clsValue, 'navigation');
        }).observe({ entryTypes: ['layout-shift'] });

        // 監控 FID (First Input Delay)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackEvent('FID', (entry as any).processingStart - (entry as any).startTime, 'interaction');
          }
        }).observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }
}
