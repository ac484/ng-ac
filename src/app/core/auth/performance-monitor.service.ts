import { Injectable } from '@angular/core';

/**
 * 性能監控服務
 * 
 * 遵循精簡主義原則，僅監控關鍵性能指標
 */
@Injectable({
    providedIn: 'root'
})
export class PerformanceMonitorService {
    private readonly metrics = new Map<string, number>();
    private readonly timers = new Map<string, number>();

    /**
     * 開始計時
     */
    startTimer(operation: string): void {
        this.timers.set(operation, performance.now());
    }

    /**
     * 結束計時並記錄
     */
    endTimer(operation: string): number {
        const startTime = this.timers.get(operation);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.recordMetric(operation, duration);
            this.timers.delete(operation);
            return duration;
        }
        return 0;
    }

    /**
     * 記錄性能指標
     */
    recordMetric(name: string, value: number): void {
        this.metrics.set(name, value);

        // 在開發環境中輸出性能日誌
        if (!this.isProduction()) {
            console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
        }
    }

    /**
     * 獲取性能指標
     */
    getMetric(name: string): number | undefined {
        return this.metrics.get(name);
    }

    /**
     * 獲取所有性能指標
     */
    getAllMetrics(): Record<string, number> {
        return Object.fromEntries(this.metrics);
    }

    /**
     * 清除所有指標
     */
    clearMetrics(): void {
        this.metrics.clear();
        this.timers.clear();
    }

    /**
     * 檢查是否為生產環境
     */
    private isProduction(): boolean {
        return typeof window !== 'undefined' &&
            window.location.hostname !== 'localhost' &&
            !window.location.hostname.includes('127.0.0.1');
    }
}