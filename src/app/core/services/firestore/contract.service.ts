/**
 * 合約管理服務 - 版本控制與智能查詢
 * 
 * 基於 base-firestore.service.ts 的原子操作
 * 實現合約版本控制、狀態管理和智能查詢
 * 保留擴展彈性，支援未來功能擴展
 */

import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, WhereCondition, OrderCondition } from './base-firestore.service';
import { Timestamp, serverTimestamp, FieldValue } from '@angular/fire/firestore';
import { Contract, ContractStatus, AmountValue, ContractStats, ContractError, ContractErrorType } from '../../types/contract.types';
import { StatusConverter } from '../../utils/type-converter';

// ===== 核心介面定義 =====

export interface ContractVersion {
  versionNumber: number;
  type: 'initial' | 'addition' | 'reduction' | 'modification';
  amount: AmountValue;
  description: string;
  createdAt: Timestamp;
  approvedBy?: string;
}

// ===== 查詢介面 =====

export interface ContractQuery {
  // 基本查詢
  contractCode?: string;
  clientName?: string;
  status?: ContractStatus;
  projectManager?: string;
  
  // 版本查詢
  versionType?: ContractVersion['type'];
  dateRange?: { start: Date; end: Date };
  
  // 金額查詢
  amountRange?: { min: AmountValue; max: AmountValue };
  
  // 排序
  sortBy?: 'createdAt' | 'lastModified' | 'totalAmount' | 'contractCode';
  sortOrder?: 'asc' | 'desc';
  
  // 分頁
  pageSize?: number;
  lastDoc?: any;
}





@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly collectionName = 'contracts';
  private readonly baseService = inject(BaseFirestoreService);

  // ===== 基礎 CRUD 操作 =====

  /** 新增合約 */
  create(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'lastModified'>): Observable<string> {
    const contractData = {
      ...data,
      versions: [],
      totalAmount: data.totalAmount || 0
    };
    return this.baseService.create<Contract>(this.collectionName, contractData);
  }

  /** 查詢單筆合約 */
  findById(id: string): Observable<Contract | null> {
    return this.baseService.findById<Contract>(this.collectionName, id)
      .pipe(
        map(contract => contract ? {
          ...contract,
          totalAmount: Number(contract.totalAmount) || 0,
          status: (contract.status || '').trim().toLowerCase() as Contract['status']
        } : null)
      );
  }

  /** 查詢多筆合約 */
  findAll(whereConditions: WhereCondition[] = [], orderConditions: OrderCondition[] = [], limitCount?: number): Observable<Contract[]> {
    return this.baseService.findAll<Contract>(this.collectionName, whereConditions, orderConditions, limitCount)
      .pipe(
        map(contracts => contracts.map(c => ({
          ...c,
          totalAmount: Number(c.totalAmount) || 0,
          status: (c.status || '').trim().toLowerCase() as Contract['status']
        })))
      );
  }

  /** 更新合約 */
  update(id: string, data: Partial<Contract>): Observable<void> {
    // 處理 lastModified 字段的型別問題
    const updateData = { ...data };
    if (updateData.lastModified === undefined) {
      updateData.lastModified = serverTimestamp() as any;
    }
    return this.baseService.modify<Contract>(this.collectionName, id, updateData);
  }

  /** 刪除合約 */
  delete(id: string): Observable<void> {
    return this.baseService.remove(this.collectionName, id);
  }

  /** 批量刪除 */
  deleteBatch(ids: string[]): Observable<void[]> {
    return this.baseService.bulkRemove(this.collectionName, ids);
  }

  // ===== 智能查詢 =====

  /** 智能查詢條件構建 */
  private buildSmartQuery(query: ContractQuery): {
    whereConditions: WhereCondition[];
    orderConditions: OrderCondition[];
  } {
    const whereConditions: WhereCondition[] = [];
    const orderConditions: OrderCondition[] = [];
    
    // 基本條件
    if (query.contractCode) {
      whereConditions.push({ field: 'contractCode', operator: '>=', value: query.contractCode });
      whereConditions.push({ field: 'contractCode', operator: '<=', value: query.contractCode + '\uf8ff' });
    }
    
    if (query.clientName) {
      whereConditions.push({ field: 'clientName', operator: '>=', value: query.clientName });
      whereConditions.push({ field: 'clientName', operator: '<=', value: query.clientName + '\uf8ff' });
    }
    
    if (query.status) {
      whereConditions.push({ field: 'status', operator: '==', value: query.status });
    }
    
    if (query.projectManager) {
      whereConditions.push({ field: 'projectManager', operator: '==', value: query.projectManager });
    }
    
    if (query.amountRange) {
      if (query.amountRange.min !== undefined) {
        whereConditions.push({ field: 'totalAmount', operator: '>=', value: query.amountRange.min });
      }
      if (query.amountRange.max !== undefined) {
        whereConditions.push({ field: 'totalAmount', operator: '<=', value: query.amountRange.max });
      }
    }
    
    // 排序
    const sortBy = query.sortBy || 'lastModified';
    const sortOrder = query.sortOrder || 'desc';
    orderConditions.push({ field: sortBy, direction: sortOrder });
    
    return { whereConditions, orderConditions };
  }

  /** 智能查詢合約 */
  queryContracts(query: ContractQuery): Observable<Contract[]> {
    const { whereConditions, orderConditions } = this.buildSmartQuery(query);
    const limitCount = query.pageSize || 50;
    
    return this.findAll(whereConditions, orderConditions, limitCount);
  }

  /** 分頁查詢 */
  queryContractsWithPagination(
    query: ContractQuery,
    pageSize: number = 20
  ): Observable<{ contracts: Contract[]; hasMore: boolean }> {
    return this.queryContracts({ ...query, pageSize }).pipe(
      map(contracts => ({
        contracts: contracts.slice(0, pageSize),
        hasMore: contracts.length > pageSize
      }))
    );
  }

  // ===== 業務查詢方法 =====

  /** 根據合約編號查詢 */
  findByContractCode(contractCode: string): Observable<Contract | null> {
    return this.findAll(
      [{ field: 'contractCode', operator: '==', value: contractCode }],
      [],
      1
    ).pipe(
      map(contracts => contracts.length > 0 ? contracts[0] : null)
    );
  }

  /** 根據狀態查詢 */
  findByStatus(status: Contract['status']): Observable<Contract[]> {
    return this.findAll(
      [{ field: 'status', operator: '==', value: status }],
      [{ field: 'lastModified', direction: 'desc' }]
    );
  }

  /** 根據專案經理查詢 */
  findByProjectManager(projectManager: string): Observable<Contract[]> {
    return this.findAll(
      [{ field: 'projectManager', operator: '==', value: projectManager }],
      [{ field: 'lastModified', direction: 'desc' }]
    );
  }

  /** 根據金額範圍查詢 */
  findByAmountRange(minAmount: number, maxAmount: number): Observable<Contract[]> {
    return this.findAll(
      [
        { field: 'totalAmount', operator: '>=', value: minAmount },
        { field: 'totalAmount', operator: '<=', value: maxAmount }
      ],
      [{ field: 'totalAmount', direction: 'desc' }]
    );
  }

  // ===== 版本控制 =====

  /** 新增版本 */
  addVersion(contractId: string, version: Omit<ContractVersion, 'versionNumber' | 'createdAt'>): Observable<void> {
    return this.findById(contractId).pipe(
      switchMap(contract => {
        if (!contract) {
          throw new Error('Contract not found');
        }
        if (contract.status === 'completed') {
          throw new Error('Cannot add version to completed contract');
        }
        
        const versions = contract.versions || [];
        const newVersion: ContractVersion = {
          ...version,
          versionNumber: versions.length + 1,
          createdAt: serverTimestamp() as any
        };
        
        return this.update(contractId, {
          versions: [...versions, newVersion],
          lastModified: serverTimestamp() as any
        });
      }),
      catchError(error => this.handleError(error))
    );
  }

  /** 審批版本 */
  approveVersion(contractId: string, versionNumber: number, approvedBy: string): Observable<void> {
    return this.findById(contractId).pipe(
      switchMap(contract => {
        if (!contract) {
          throw new Error('Contract not found');
        }
        
        const versions = contract.versions || [];
        const versionIndex = versions.findIndex(v => v.versionNumber === versionNumber);
        
        if (versionIndex === -1) {
          throw new Error('Version not found');
        }
        
        if (versions[versionIndex].approvedBy) {
          throw new Error('Version already approved');
        }
        
        const updatedVersions = [...versions];
        updatedVersions[versionIndex] = {
          ...updatedVersions[versionIndex],
          approvedBy
        };
        
        return this.update(contractId, {
          versions: updatedVersions,
          lastModified: serverTimestamp() as any
        });
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ===== 狀態管理 =====

  /** 狀態轉換規則 */
  private readonly statusTransitions: Record<Contract['status'], Contract['status'][]> = {
    'draft': ['preparing', 'active'],
    'preparing': ['active', 'draft'],
    'active': ['completed', 'preparing'],
    'completed': [] // 終止狀態
  };

  /** 檢查狀態轉換是否有效 */
  private canTransitionTo(currentStatus: Contract['status'], newStatus: Contract['status']): boolean {
    const allowedTransitions = this.statusTransitions[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }

  /** 更新狀態 */
  updateStatus(contractId: string, newStatus: ContractStatus): Observable<void> {
    return this.findById(contractId).pipe(
      switchMap(contract => {
        if (!contract) {
          throw new Error('Contract not found');
        }
        
        if (!this.canTransitionTo(contract.status, newStatus)) {
          throw new Error(`Invalid status transition from ${contract.status} to ${newStatus}`);
        }
        
        return this.update(contractId, { 
          status: newStatus, 
          lastModified: serverTimestamp() as any
        });
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ===== 統計查詢 =====

  /** 獲取合約統計 */
  getContractStats(): Observable<ContractStats> {
    return combineLatest([
      this.findByStatus('draft'),
      this.findByStatus('preparing'),
      this.findByStatus('active'),
      this.findByStatus('completed')
    ]).pipe(
      map(([draft, preparing, active, completed]) => {
        const allContracts = [...draft, ...preparing, ...active, ...completed];
        const totalAmount = allContracts.reduce((sum, contract) => sum + (contract.totalAmount || 0), 0);
        
        return {
          total: allContracts.length,
          draft: draft.length,
          preparing: preparing.length,
          active: active.length,
          completed: completed.length,
          totalAmount
        };
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ===== 錯誤處理 =====

  /** 錯誤分類 */
  private categorizeError(error: any): ContractErrorType {
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          return ContractErrorType.PERMISSION_DENIED;
        case 'unavailable':
          return ContractErrorType.UNAVAILABLE;
        case 'unauthenticated':
          return ContractErrorType.UNAUTHENTICATED;
        case 'not-found':
          return ContractErrorType.CONTRACT_NOT_FOUND;
        case 'already-exists':
          return ContractErrorType.DUPLICATE_CONTRACT_CODE;
        case 'resource-exhausted':
          return ContractErrorType.AMOUNT_VALIDATION_FAILED;
        case 'failed-precondition':
          return ContractErrorType.INVALID_STATUS_TRANSITION;
        case 'aborted':
          return ContractErrorType.VERSION_CONFLICT;
        default:
          return ContractErrorType.CONTRACT_NOT_FOUND;
      }
    }
    return ContractErrorType.CONTRACT_NOT_FOUND;
  }

  /** 獲取用戶友好錯誤訊息 */
  private getUserFriendlyMessage(errorType: ContractErrorType): string {
    const messages = {
      [ContractErrorType.PERMISSION_DENIED]: '權限不足，請檢查 Firestore 安全規則',
      [ContractErrorType.UNAVAILABLE]: 'Firestore 服務暫時無法使用，請稍後再試',
      [ContractErrorType.UNAUTHENTICATED]: '未驗證用戶，請重新登入',
      [ContractErrorType.CONTRACT_NOT_FOUND]: '合約不存在或已被刪除',
      [ContractErrorType.VERSION_CONFLICT]: '版本衝突，請重新整理後再試',
      [ContractErrorType.INVALID_STATUS_TRANSITION]: '狀態轉換無效，請檢查業務規則',
      [ContractErrorType.AMOUNT_VALIDATION_FAILED]: '金額驗證失敗，請檢查輸入值',
      [ContractErrorType.DUPLICATE_CONTRACT_CODE]: '合約編號重複，請使用其他編號',
      [ContractErrorType.INVALID_VERSION_TYPE]: '版本類型無效',
      [ContractErrorType.APPROVAL_REQUIRED]: '需要審批才能執行此操作'
    };
    return messages[errorType] || '操作失敗，請稍後再試';
  }

  /** 處理錯誤 */
  private handleError(error: any): Observable<never> {
    const errorType = this.categorizeError(error);
    const message = this.getUserFriendlyMessage(errorType);
    
    console.error(`ContractService 錯誤 [${errorType}]:`, error);
    
    return throwError(() => ({
      type: errorType,
      message,
      originalError: error
    }));
  }

  // ===== 工具方法 =====

  /** 生成合約編號 */
  generateContractCode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-3);
    
    return `${year}${month}${day}-${timestamp}`;
  }

  /** 檢查合約編號是否存在 */
  checkContractCodeExists(contractCode: string): Observable<boolean> {
    return this.findByContractCode(contractCode).pipe(
      map(contract => contract !== null)
    );
  }

  // ===== 擴展方法（保留彈性） =====

  /** 根據標籤查詢 */
  findByTags(tags: string[]): Observable<Contract[]> {
    // 注意：Firestore 不支援陣列包含查詢，這裡使用簡單的前綴匹配
    return this.findAll(
      [{ field: 'tags', operator: 'array-contains', value: tags[0] }],
      [{ field: 'lastModified', direction: 'desc' }]
    );
  }

  /** 根據分類查詢 */
  findByCategory(category: string): Observable<Contract[]> {
    return this.findAll(
      [{ field: 'category', operator: '==', value: category }],
      [{ field: 'lastModified', direction: 'desc' }]
    );
  }

  /** 搜索合約 */
  searchContracts(searchTerm: string): Observable<Contract[]> {
    return this.findAll(
      [
        { field: 'contractName', operator: '>=', value: searchTerm },
        { field: 'contractName', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      [{ field: 'contractName', direction: 'asc' }]
    );
  }
}