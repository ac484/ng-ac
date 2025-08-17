/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular AI服務-AI功能數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["BaseFirebaseService", "BaseQueryOptions"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(AIService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, map, throwError } from 'rxjs';
import { BaseFirebaseService } from './base-firebase.service';

export interface AIAnalysis {
  id: string;
  type: 'document' | 'project' | 'contract' | 'partner' | 'performance';
  entityId: string;
  entityType: string;
  analysisDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: AIAnalysisResult[];
  confidence: number;
  processingTime: number;
  model: string;
  version: string;
  metadata: Record<string, any>;
}

export interface AIAnalysisResult {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface AIPrediction {
  id: string;
  type: 'trend' | 'risk' | 'opportunity' | 'performance';
  entityId?: string;
  entityType?: string;
  predictionDate: string;
  horizon: 'short' | 'medium' | 'long';
  confidence: number;
  factors: string[];
  impact: 'positive' | 'negative' | 'neutral';
  probability: number;
  description: string;
  actions: string[];
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'correlation' | 'trend';
  category: 'business' | 'technical' | 'financial' | 'operational';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  source: string;
  timestamp: string;
  relatedEntities: string[];
  tags: string[];
  actionable: boolean;
  actions: string[];
}

export interface CreateAIAnalysisDto {
  type: 'document' | 'project' | 'contract' | 'partner' | 'performance';
  entityId: string;
  entityType: string;
  model?: string;
  version?: string;
  metadata?: Record<string, any>;
}

export interface CreateAIPredictionDto {
  type: 'trend' | 'risk' | 'opportunity' | 'performance';
  entityId?: string;
  entityType?: string;
  horizon: 'short' | 'medium' | 'long';
  confidence: number;
  factors: string[];
  impact: 'positive' | 'negative' | 'neutral';
  probability: number;
  description: string;
  actions: string[];
}

export interface CreateAIInsightDto {
  type: 'pattern' | 'anomaly' | 'correlation' | 'trend';
  category: 'business' | 'technical' | 'financial' | 'operational';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  source: string;
  relatedEntities?: string[];
  tags?: string[];
  actionable?: boolean;
  actions?: string[];
}

export interface AIStats {
  totalAnalyses: number;
  totalPredictions: number;
  totalInsights: number;
  averageConfidence: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  processingTime: {
    average: number;
    min: number;
    max: number;
  };
}

export interface AISearchFilters {
  type?: string;
  status?: string;
  entityId?: string;
  entityType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  confidence?: {
    min: number;
    max: number;
  };
  tags?: string[];
  severity?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIService extends BaseFirebaseService<AIAnalysis> {
  private readonly _isProcessing = new BehaviorSubject<boolean>(false);
  readonly isProcessing$ = this._isProcessing.asObservable();

  constructor(firestore: any) {
    super(firestore, 'ai_analyses');
  }

  // 獲取處理狀態
  get isProcessing(): boolean {
    return this._isProcessing.value;
  }

  // 設置處理狀態
  setProcessing(processing: boolean): void {
    this._isProcessing.next(processing);
  }

  // 創建 AI 分析
  createAnalysis(analysisData: CreateAIAnalysisDto): Observable<string> {
    const newAnalysis: Omit<AIAnalysis, 'id'> = {
      ...analysisData,
      analysisDate: new Date().toISOString(),
      status: 'pending',
      results: [],
      confidence: 0,
      processingTime: 0,
      model: analysisData.model || 'gpt-4',
      version: analysisData.version || '1.0',
      metadata: analysisData.metadata || {}
    };

    return this.create(newAnalysis);
  }

  // 更新分析狀態
  updateAnalysisStatus(analysisId: string, status: AIAnalysis['status']): Observable<void> {
    return this.update(analysisId, { status });
  }

  // 更新分析結果
  updateAnalysisResults(analysisId: string, results: AIAnalysisResult[], confidence: number, processingTime: number): Observable<void> {
    return this.update(analysisId, {
      results,
      confidence,
      processingTime,
      status: 'completed'
    });
  }

  // 獲取待處理的分析
  getPendingAnalyses(): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'pending' }],
      orderBy: { field: 'analysisDate', direction: 'asc' }
    });
  }

  // 獲取處理中的分析
  getProcessingAnalyses(): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'processing' }],
      orderBy: { field: 'analysisDate', direction: 'asc' }
    });
  }

  // 獲取已完成的分析
  getCompletedAnalyses(): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'completed' }],
      orderBy: { field: 'analysisDate', direction: 'desc' }
    });
  }

  // 根據實體獲取分析
  getAnalysesByEntity(entityId: string, entityType?: string): Observable<AIAnalysis[]> {
    let whereConditions = [{ field: 'entityId', operator: '==', value: entityId }];

    if (entityType) {
      whereConditions.push({ field: 'entityType', operator: '==', value: entityType });
    }

    return this.getAll({
      where: whereConditions,
      orderBy: { field: 'analysisDate', direction: 'desc' }
    });
  }

  // 根據類型獲取分析
  getAnalysesByType(type: AIAnalysis['type']): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [{ field: 'type', operator: '==', value: type }],
      orderBy: { field: 'analysisDate', direction: 'desc' }
    });
  }

  // 獲取 AI 統計
  getAIStats(): Observable<AIStats> {
    return this.getAll().pipe(
      map(analyses => {
        const totalAnalyses = analyses.length;
        const completedAnalyses = analyses.filter(a => a.status === 'completed');

        const byType: Record<string, number> = {};
        const byStatus: Record<string, number> = {};

        analyses.forEach(analysis => {
          byType[analysis.type] = (byType[analysis.type] || 0) + 1;
          byStatus[analysis.status] = (byStatus[analysis.status] || 0) + 1;
        });

        const averageConfidence = completedAnalyses.length > 0
          ? completedAnalyses.reduce((sum, a) => sum + a.confidence, 0) / completedAnalyses.length
          : 0;

        const processingTimes = completedAnalyses.map(a => a.processingTime);
        const avgProcessingTime = processingTimes.length > 0
          ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
          : 0;

        return {
          totalAnalyses,
          totalPredictions: 0, // 需要實現預測服務
          totalInsights: 0, // 需要實現洞察服務
          averageConfidence: Math.round(averageConfidence * 100) / 100,
          byType,
          byStatus,
          processingTime: {
            average: Math.round(avgProcessingTime),
            min: processingTimes.length > 0 ? Math.min(...processingTimes) : 0,
            max: processingTimes.length > 0 ? Math.max(...processingTimes) : 0
          }
        };
      }),
      catchError(error => {
        console.error('Error getting AI stats:', error);
        return throwError(() => new Error('Failed to get AI stats'));
      })
    );
  }

  // 搜索分析
  searchAnalyses(searchTerm: string): Observable<AIAnalysis[]> {
    return this.getAll().pipe(
      map(analyses => {
        return analyses.filter(analysis =>
          analysis.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          analysis.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          analysis.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      catchError(error => {
        console.error('Error searching analyses:', error);
        return throwError(() => new Error('Failed to search analyses'));
      })
    );
  }

  // 根據過濾器獲取分析
  getAnalysesByFilters(filters: AISearchFilters): Observable<AIAnalysis[]> {
    return this.getAll().pipe(
      map(analyses => {
        let filtered = analyses;

        // 類型過濾
        if (filters.type) {
          filtered = filtered.filter(a => a.type === filters.type);
        }

        // 狀態過濾
        if (filters.status) {
          filtered = filtered.filter(a => a.status === filters.status);
        }

        // 實體ID過濾
        if (filters.entityId) {
          filtered = filtered.filter(a => a.entityId === filters.entityId);
        }

        // 實體類型過濾
        if (filters.entityType) {
          filtered = filtered.filter(a => a.entityType === filters.entityType);
        }

        // 日期範圍過濾
        if (filters.dateRange) {
          filtered = filtered.filter(a => {
            const analysisDate = new Date(a.analysisDate);
            return analysisDate >= filters.dateRange!.start && analysisDate <= filters.dateRange!.end;
          });
        }

        // 置信度過濾
        if (filters.confidence) {
          if (filters.confidence.min !== undefined) {
            filtered = filtered.filter(a => a.confidence >= filters.confidence!.min!);
          }
          if (filters.confidence.max !== undefined) {
            filtered = filtered.filter(a => a.confidence <= filters.confidence!.max!);
          }
        }

        // 標籤過濾
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter(a =>
            a.results.some(result =>
              filters.tags!.some(tag => result.tags.includes(tag))
            )
          );
        }

        return filtered.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
      }),
      catchError(error => {
        console.error('Error filtering analyses:', error);
        return throwError(() => new Error('Failed to filter analyses'));
      })
    );
  }

  // 獲取高置信度分析
  getHighConfidenceAnalyses(threshold: number = 0.8): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'completed' },
        { field: 'confidence', operator: '>=', value: threshold }
      ],
      orderBy: { field: 'confidence', direction: 'desc' }
    });
  }

  // 獲取低置信度分析
  getLowConfidenceAnalyses(threshold: number = 0.5): Observable<AIAnalysis[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'completed' },
        { field: 'confidence', operator: '<=', value: threshold }
      ],
      orderBy: { field: 'confidence', direction: 'asc' }
    });
  }

  // 獲取分析實時更新
  getAnalysesRealtime(): Observable<AIAnalysis[]> {
    return this.subscribeToCollection();
  }

  // 獲取單個分析實時更新
  getAnalysisRealtime(analysisId: string): Observable<AIAnalysis | null> {
    return this.subscribeToDocument(analysisId);
  }

  // 批量更新分析狀態
  batchUpdateAnalysisStatus(analysisIds: string[], status: AIAnalysis['status']): Observable<void> {
    const operations = analysisIds.map(id => ({
      type: 'update' as const,
      id,
      data: { status }
    }));

    return this.batch(operations);
  }

  // 獲取分析性能統計
  getAnalysisPerformanceStats(): Observable<{
    totalAnalyses: number;
    successRate: number;
    averageProcessingTime: number;
    modelPerformance: Record<string, {
      count: number;
      averageConfidence: number;
      averageProcessingTime: number;
    }>;
  }> {
    return this.getAll().pipe(
      map(analyses => {
        const totalAnalyses = analyses.length;
        const completedAnalyses = analyses.filter(a => a.status === 'completed');
        const successRate = totalAnalyses > 0 ? (completedAnalyses.length / totalAnalyses) * 100 : 0;

        const averageProcessingTime = completedAnalyses.length > 0
          ? completedAnalyses.reduce((sum, a) => sum + a.processingTime, 0) / completedAnalyses.length
          : 0;

        // 按模型統計性能
        const modelPerformance: Record<string, {
          count: number;
          averageConfidence: number;
          averageProcessingTime: number;
        }> = {};

        completedAnalyses.forEach(analysis => {
          if (!modelPerformance[analysis.model]) {
            modelPerformance[analysis.model] = {
              count: 0,
              averageConfidence: 0,
              averageProcessingTime: 0
            };
          }

          const model = modelPerformance[analysis.model];
          model.count++;
          model.averageConfidence += analysis.confidence;
          model.averageProcessingTime += analysis.processingTime;
        });

        // 計算平均值
        Object.values(modelPerformance).forEach(model => {
          model.averageConfidence = Math.round((model.averageConfidence / model.count) * 100) / 100;
          model.averageProcessingTime = Math.round(model.averageProcessingTime / model.count);
        });

        return {
          totalAnalyses,
          successRate: Math.round(successRate * 100) / 100,
          averageProcessingTime: Math.round(averageProcessingTime),
          modelPerformance
        };
      }),
      catchError(error => {
        console.error('Error getting analysis performance stats:', error);
        return throwError(() => new Error('Failed to get analysis performance stats'));
      })
    );
  }

  // 清理過期分析
  cleanupExpiredAnalyses(daysOld: number = 90): Observable<void> {
    return this.getAll().pipe(
      map(analyses => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const expiredAnalyses = analyses.filter(analysis => {
          const analysisDate = new Date(analysis.analysisDate);
          return analysisDate < cutoffDate && analysis.status === 'completed';
        });

        return expiredAnalyses.map(analysis => ({
          type: 'delete' as const,
          id: analysis.id
        }));
      }),
      map(operations => {
        if (operations.length === 0) {
          return from(Promise.resolve());
        }
        return this.batch(operations);
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error cleaning up expired analyses:', error);
        return throwError(() => new Error('Failed to cleanup expired analyses'));
      })
    );
  }
}
