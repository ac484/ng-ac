/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular文件管理服務-文件數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["BaseFirebaseService", "ComplianceDocument", "Contract"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(DocumentService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseFirebaseService } from './base-firebase.service';

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'compliance' | 'project' | 'partner' | 'general';
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Draft' | 'Archived';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  expiryDate?: string;
  tags: string[];
  description?: string;
  uploadedBy: string;
  relatedEntityId?: string; // 關聯的實體ID（專案、合約、合作夥伴等）
  relatedEntityType?: string; // 關聯的實體類型
  version: string;
  checksum: string; // 文件完整性校驗
}

export interface CreateDocumentDto {
  name: string;
  type: 'contract' | 'compliance' | 'project' | 'partner' | 'general';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  description?: string;
  uploadedBy: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  expiryDate?: string;
  version?: string;
  checksum: string;
}

export interface UpdateDocumentDto {
  name?: string;
  status?: 'Valid' | 'Expiring Soon' | 'Expired' | 'Draft' | 'Archived';
  tags?: string[];
  description?: string;
  expiryDate?: string;
  version?: string;
}

export interface DocumentStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalSize: number;
  expiringSoon: number;
  expired: number;
}

export interface DocumentSearchFilters {
  type?: 'contract' | 'compliance' | 'project' | 'partner' | 'general';
  status?: 'Valid' | 'Expiring Soon' | 'Expired' | 'Draft' | 'Archived';
  tags?: string[];
  uploadedBy?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minSize?: number;
  maxSize?: number;
  mimeTypes?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseFirebaseService<Document> {
  constructor(firestore: any) {
    super(firestore, 'documents');
  }

  // 獲取有效文件
  getValidDocuments(): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Valid' }],
      orderBy: { field: 'uploadDate', direction: 'desc' }
    });
  }

  // 獲取即將到期的文件
  getExpiringDocuments(days: number = 30): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Valid' }],
      orderBy: { field: 'expiryDate', direction: 'asc' }
    }).pipe(
      map(documents => {
        const now = new Date();
        const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

        return documents.filter(doc => {
          if (!doc.expiryDate) return false;
          const expiryDate = new Date(doc.expiryDate);
          return expiryDate <= deadline && expiryDate >= now;
        });
      })
    );
  }

  // 獲取過期文件
  getExpiredDocuments(): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Expired' }],
      orderBy: { field: 'expiryDate', direction: 'desc' }
    });
  }

  // 根據類型獲取文件
  getDocumentsByType(type: Document['type']): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'type', operator: '==', value: type }],
      orderBy: { field: 'uploadDate', direction: 'desc' }
    });
  }

  // 根據狀態獲取文件
  getDocumentsByStatus(status: Document['status']): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: { field: 'uploadDate', direction: 'desc' }
    });
  }

  // 根據標籤獲取文件
  getDocumentsByTags(tags: string[]): Observable<Document[]> {
    return this.getAll().pipe(
      map(documents => {
        return documents.filter(doc =>
          tags.some(tag => doc.tags.includes(tag))
        );
      })
    );
  }

  // 根據上傳者獲取文件
  getDocumentsByUploader(uploadedBy: string): Observable<Document[]> {
    return this.getAll({
      where: [{ field: 'uploadedBy', operator: '==', value: uploadedBy }],
      orderBy: { field: 'uploadDate', direction: 'desc' }
    });
  }

  // 根據關聯實體獲取文件
  getDocumentsByEntity(entityId: string, entityType?: string): Observable<Document[]> {
    let whereConditions = [{ field: 'relatedEntityId', operator: '==', value: entityId }];

    if (entityType) {
      whereConditions.push({ field: 'relatedEntityType', operator: '==', value: entityType });
    }

    return this.getAll({
      where: whereConditions,
      orderBy: { field: 'uploadDate', direction: 'desc' }
    });
  }

  // 獲取文件統計
  getDocumentStats(): Observable<DocumentStats> {
    return this.getAll().pipe(
      map(documents => {
        const total = documents.length;
        const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);

        // 按類型統計
        const byType: Record<string, number> = {};
        documents.forEach(doc => {
          byType[doc.type] = (byType[doc.type] || 0) + 1;
        });

        // 按狀態統計
        const byStatus: Record<string, number> = {};
        documents.forEach(doc => {
          byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;
        });

        // 即將到期的文件數量
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expiringSoon = documents.filter(doc => {
          if (!doc.expiryDate || doc.status !== 'Valid') return false;
          const expiryDate = new Date(doc.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
        }).length;

        // 過期文件數量
        const expired = documents.filter(doc => doc.status === 'Expired').length;

        return {
          total,
          byType,
          byStatus,
          totalSize,
          expiringSoon,
          expired
        };
      }),
      catchError(error => {
        console.error('Error getting document stats:', error);
        return throwError(() => new Error('Failed to get document stats'));
      })
    );
  }

  // 搜索文件
  searchDocuments(searchTerm: string): Observable<Document[]> {
    return this.getAll().pipe(
      map(documents => {
        return documents.filter(doc =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      catchError(error => {
        console.error('Error searching documents:', error);
        return throwError(() => new Error('Failed to search documents'));
      })
    );
  }

  // 根據過濾器獲取文件
  getDocumentsByFilters(filters: DocumentSearchFilters): Observable<Document[]> {
    return this.getAll().pipe(
      map(documents => {
        let filtered = documents;

        // 類型過濾
        if (filters.type) {
          filtered = filtered.filter(doc => doc.type === filters.type);
        }

        // 狀態過濾
        if (filters.status) {
          filtered = filtered.filter(doc => doc.status === filters.status);
        }

        // 標籤過濾
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter(doc =>
            filters.tags!.some(tag => doc.tags.includes(tag))
          );
        }

        // 上傳者過濾
        if (filters.uploadedBy) {
          filtered = filtered.filter(doc => doc.uploadedBy === filters.uploadedBy);
        }

        // 關聯實體ID過濾
        if (filters.relatedEntityId) {
          filtered = filtered.filter(doc => doc.relatedEntityId === filters.relatedEntityId);
        }

        // 關聯實體類型過濾
        if (filters.relatedEntityType) {
          filtered = filtered.filter(doc => doc.relatedEntityType === filters.relatedEntityType);
        }

        // 日期範圍過濾
        if (filters.dateRange) {
          filtered = filtered.filter(doc => {
            const uploadDate = new Date(doc.uploadDate);
            return uploadDate >= filters.dateRange!.start && uploadDate <= filters.dateRange!.end;
          });
        }

        // 文件大小過濾
        if (filters.minSize !== undefined) {
          filtered = filtered.filter(doc => doc.fileSize >= filters.minSize!);
        }

        if (filters.maxSize !== undefined) {
          filtered = filtered.filter(doc => doc.fileSize <= filters.maxSize!);
        }

        // MIME類型過濾
        if (filters.mimeTypes && filters.mimeTypes.length > 0) {
          filtered = filtered.filter(doc => filters.mimeTypes!.includes(doc.mimeType));
        }

        return filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      }),
      catchError(error => {
        console.error('Error filtering documents:', error);
        return throwError(() => new Error('Failed to filter documents'));
      })
    );
  }

  // 創建新文件
  createDocument(documentData: CreateDocumentDto): Observable<string> {
    const newDocument: Omit<Document, 'id'> = {
      ...documentData,
      status: 'Valid',
      uploadDate: new Date().toISOString(),
      tags: documentData.tags || [],
      version: documentData.version || '1.0'
    };

    return this.create(newDocument);
  }

  // 更新文件
  updateDocument(documentId: string, updateData: UpdateDocumentDto): Observable<void> {
    return this.update(documentId, updateData);
  }

  // 更新文件狀態
  updateDocumentStatus(documentId: string, status: Document['status']): Observable<void> {
    return this.update(documentId, { status });
  }

  // 添加標籤
  addTag(documentId: string, tag: string): Observable<void> {
    return this.getById(documentId).pipe(
      map(document => {
        if (!document) {
          throw new Error('Document not found');
        }

        if (document.tags.includes(tag)) {
          throw new Error('Tag already exists');
        }

        const updatedTags = [...document.tags, tag];
        return { documentId, updatedTags };
      }),
      map(({ documentId, updatedTags }) => {
        return this.update(documentId, { tags: updatedTags });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding tag:', error);
        return throwError(() => new Error('Failed to add tag'));
      })
    );
  }

  // 移除標籤
  removeTag(documentId: string, tag: string): Observable<void> {
    return this.getById(documentId).pipe(
      map(document => {
        if (!document) {
          throw new Error('Document not found');
        }

        const updatedTags = document.tags.filter(t => t !== tag);
        return { documentId, updatedTags };
      }),
      map(({ documentId, updatedTags }) => {
        return this.update(documentId, { tags: updatedTags });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error removing tag:', error);
        return throwError(() => new Error('Failed to remove tag'));
      })
    );
  }

  // 獲取文件實時更新
  getDocumentsRealtime(): Observable<Document[]> {
    return this.subscribeToCollection();
  }

  // 獲取單個文件實時更新
  getDocumentRealtime(documentId: string): Observable<Document | null> {
    return this.subscribeToDocument(documentId);
  }

  // 檢查文件是否即將到期
  isDocumentExpiringSoon(document: Document, days: number = 30): boolean {
    if (document.status !== 'Valid' || !document.expiryDate) return false;

    const now = new Date();
    const expiryDate = new Date(document.expiryDate);
    const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return expiryDate <= deadline && expiryDate >= now;
  }

  // 獲取文件大小統計
  getDocumentSizeStats(): Observable<{
    totalSize: number;
    averageSize: number;
    minSize: number;
    maxSize: number;
    byType: Record<string, number>;
  }> {
    return this.getAll().pipe(
      map(documents => {
        const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
        const averageSize = documents.length > 0 ? totalSize / documents.length : 0;
        const minSize = documents.length > 0 ? Math.min(...documents.map(d => d.fileSize)) : 0;
        const maxSize = documents.length > 0 ? Math.max(...documents.map(d => d.fileSize)) : 0;

        // 按類型統計文件大小
        const byType: Record<string, number> = {};
        documents.forEach(doc => {
          byType[doc.type] = (byType[doc.type] || 0) + doc.fileSize;
        });

        return {
          totalSize,
          averageSize: Math.round(averageSize),
          minSize,
          maxSize,
          byType
        };
      }),
      catchError(error => {
        console.error('Error getting document size stats:', error);
        return throwError(() => new Error('Failed to get document size stats'));
      })
    );
  }

  // 批量更新文件狀態
  batchUpdateDocumentStatus(documentIds: string[], status: Document['status']): Observable<void> {
    const operations = documentIds.map(id => ({
      type: 'update' as const,
      id,
      data: { status }
    }));

    return this.batch(operations);
  }

  // 獲取文件版本歷史
  getDocumentVersions(documentName: string): Observable<Document[]> {
    return this.getAll().pipe(
      map(documents => {
        return documents
          .filter(doc => doc.name === documentName)
          .sort((a, b) => {
            const versionA = parseFloat(a.version);
            const versionB = parseFloat(b.version);
            return versionB - versionA;
          });
      }),
      catchError(error => {
        console.error('Error getting document versions:', error);
        return throwError(() => new Error('Failed to get document versions'));
      })
    );
  }
}
