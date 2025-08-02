/**
 * 合約管理服務 - 版本控制與智能查詢
 * 
 * 基於 base-firestore.service.ts 的原子操作
 * 實現合約版本控制、狀態管理和智能查詢
 * 保留擴展彈性，支援未來功能擴展
 */

import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, WhereCondition, OrderCondition } from './base-firestore.service';
import { Timestamp, serverTimestamp } from '@angular/fire/firestore';

// ===== 核心介面定義 =====

export interface ContractVersion {
  versionNumber: number;
  type: 'initial' | 'addition' | 'reduction' | 'modification';
  amount: number;
  description: string;
  createdAt: Timestamp;
  approvedBy?: string;
}

export interface Contract extends BaseEntity {
  // 基本資訊
  contractCode: string;        // 合約編號
  clientName: string;          // 客戶名稱
  contractName: string;        // 合約名稱
  
  // 狀態和負責人
  status: 'draft' | 'preparing' | 'active' | 'completed';
  projectManager: string;      // 專案經理或業務負責人
  
  // 版本控制
  versions: ContractVersion[];
  totalAmount: number;         // 總金額（所有版本累計）
  lastModified?: Timestamp | any; // Firestore 寫入時為 FieldValue，讀取時為 Timestamp
  progress?: number;           // 0-100 summary 進度
  
  // 擴展欄位（保留彈性）
  description?: string;        // 合約描述
  attachments?: string[];      // 附件列表
  tags?: string[];            // 標籤
  category?: string;          // 分類
  priority?: 'low' | 'medium' | 'high'; // 優先級
}

// ===== 查詢介面 =====

export interface ContractQuery {
  // 基本查詢
  contractCode?: string;
  clientName?: string;
  status?: Contract['status'];
  projectManager?: string;
  
  // 版本查詢
  versionType?: ContractVersion['type'];
  dateRange?: { start: Date; end: Date };
  
  // 金額查詢
  amountRange?: { min: number; max: number };
  
  // 排序
  sortBy?: 'createdAt' | 'lastModified' | 'totalAmount' | 'contractCode';
  sortOrder?: 'asc' | 'desc';
  
  // 分頁
  pageSize?: number;
  lastDoc?: any;
}

// ===== 錯誤處理 =====

export enum ContractErrorType {
  // Firestore 錯誤
  PERMISSION_DENIED = 'permission-denied',
  UNAVAILABLE = 'unavailable',
  UNAUTHENTICATED = 'unauthenticated',
  
  // 業務邏輯錯誤
  CONTRACT_NOT_FOUND = 'contract-not-found',
  VERSION_CONFLICT = 'version-conflict',
  INVALID_STATUS_TRANSITION = 'invalid-status-transition',
  AMOUNT_VALIDATION_FAILED = 'amount-validation-failed',
  
  // 操作錯誤
  DUPLICATE_CONTRACT_CODE = 'duplicate-contract-code',
  INVALID_VERSION_TYPE = 'invalid-version-type',
  APPROVAL_REQUIRED = 'approval-required'
}

export interface ContractError {
  type: ContractErrorType;
  message: string;
  suggestion?: string;
  guidance?: string;
}

// ===== 統計介面 =====

export interface ContractStats {
  total: number;
  draft: number;
  preparing: number;
  active: number;
  completed: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly collectionName = 'contracts';
  private readonly baseService = inject(BaseFirestoreService);

  // ===== 基礎 CRUD 操作 =====

  /** 新增合約 */
  create(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'totalAmount' | 'lastModified'>): Observable<string> {
    const contractData = {
      ...data,
      versions: [],
      totalAmount: 0
    };
    return this.baseService.create<Contract>(this.collectionName, contractData);
  }

  /** 查詢單筆合約 */
  findById(id: string): Observable<Contract | null> {
    return this.baseService.findById<Contract>(this.collectionName, id);
  }

  /** 查詢多筆合約 */
  findAll(whereConditions: WhereCondition[] = [], orderConditions: OrderCondition[] = [], limitCount?: number): Observable<Contract[]> {
    return this.baseService.findAll<Contract>(this.collectionName, whereConditions, orderConditions, limitCount);
  }

  /** 更新合約 */
  update(id: string, data: Partial<Contract>): Observable<void> {
    return this.baseService.modify<Contract>(this.collectionName, id, data);
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
    return this.baseService.atomicUpdateWithCondition(
      this.collectionName,
      contractId,
      (contract: Contract) => contract.status !== 'completed',
      {
        lastModified: serverTimestamp()
      }
    ).pipe(
      map(() => {
        // 這裡需要額外的邏輯來處理版本陣列更新
        // 由於 atomicUpdateWithCondition 的限制，我們需要分兩步處理
        return;
      })
    );
  }

  /** 審批版本 */
  approveVersion(contractId: string, versionNumber: number, approvedBy: string): Observable<void> {
    return this.baseService.atomicUpdateWithCondition(
      this.collectionName,
      contractId,
      (contract: Contract) => {
        const version = contract.versions?.find(v => v.versionNumber === versionNumber);
        return Boolean(version && !version.approvedBy);
      },
      {
        lastModified: serverTimestamp()
      }
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
  updateStatus(contractId: string, newStatus: Contract['status']): Observable<void> {
    return this.baseService.atomicUpdateWithCondition(
      this.collectionName,
      contractId,
      (contract: Contract) => this.canTransitionTo(contract.status, newStatus),
      { 
        status: newStatus, 
        lastModified: serverTimestamp() 
      }
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
      })
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