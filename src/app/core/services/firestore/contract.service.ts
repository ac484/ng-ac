/**
 * 合約管理服務
 * 
 * 管理合約資料的 CRUD 操作
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, QueryOptions } from './base-firestore.service';

export interface Contract extends BaseEntity {
  // 基本資訊
  contractCode: string;        // 合約編號 20250802-001
  clientName: string;          // 客戶名稱
  clientRepresentative: string; // 客戶代表
  contactPerson: string;       // 客戶窗口
  contractName: string;        // 合約名稱
  
  // 金額和版本
  amount: number;              // 總金額
  version: string;             // 版本 V1.0、V2.3
  
  // 進度和狀態
  progress: number;            // 總進度 0-100
  status: 'active' | 'completed' | 'cancelled'; // 進行中/結案/已取消
  
  // 時間相關
  startDate?: Date;            // 開始日期
  endDate?: Date;              // 結束日期
  signDate?: Date;             // 簽約日期
  
  // 其他資訊
  description?: string;        // 合約描述
  attachments?: string[];      // 附件列表
  notes?: string;              // 備註
  
  // 負責人資訊
  projectManager?: string;     // 專案經理
  salesPerson?: string;        // 業務負責人
  
  // 付款相關
  paymentTerms?: string;       // 付款條件
  paymentStatus?: 'pending' | 'partial' | 'completed'; // 付款狀態
  
  // 標籤和分類
  tags?: string[];             // 標籤
  category?: string;           // 分類
  priority?: 'low' | 'medium' | 'high'; // 優先級
}

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseFirestoreService<Contract> {
  protected collectionName = 'contracts';

  /**
   * 根據合約編號獲取合約
   */
  getByContractCode(contractCode: string): Observable<Contract | null> {
    return this.getAll({
      where: [{ field: 'contractCode', operator: '==', value: contractCode }],
      limit: 1
    }).pipe(
      map(contracts => contracts.length > 0 ? contracts[0] : null)
    );
  }

  /**
   * 根據客戶名稱獲取合約
   */
  getByClientName(clientName: string): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'clientName', operator: '==', value: clientName }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * 根據狀態獲取合約
   */
  getByStatus(status: Contract['status']): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * 獲取進行中的合約
   */
  getActiveContracts(): Observable<Contract[]> {
    return this.getByStatus('active');
  }

  /**
   * 獲取已完成的合約
   */
  getCompletedContracts(): Observable<Contract[]> {
    return this.getByStatus('completed');
  }

  /**
   * 根據金額範圍獲取合約
   */
  getByAmountRange(minAmount: number, maxAmount: number): Observable<Contract[]> {
    return this.getAll({
      where: [
        { field: 'amount', operator: '>=', value: minAmount },
        { field: 'amount', operator: '<=', value: maxAmount }
      ],
      orderBy: [{ field: 'amount', direction: 'desc' }]
    });
  }

  /**
   * 根據進度範圍獲取合約
   */
  getByProgressRange(minProgress: number, maxProgress: number): Observable<Contract[]> {
    return this.getAll({
      where: [
        { field: 'progress', operator: '>=', value: minProgress },
        { field: 'progress', operator: '<=', value: maxProgress }
      ],
      orderBy: [{ field: 'progress', direction: 'desc' }]
    });
  }

  /**
   * 搜尋合約
   */
  searchContracts(searchTerm: string): Observable<Contract[]> {
    // 注意：Firestore 不支援全文搜尋，這裡使用簡單的前綴匹配
    return this.getAll({
      where: [
        { field: 'contractName', operator: '>=', value: searchTerm },
        { field: 'contractName', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      orderBy: [{ field: 'contractName', direction: 'asc' }]
    });
  }

  /**
   * 更新合約進度
   */
  updateProgress(contractId: string, progress: number): Observable<void> {
    // 自動更新狀態
    let status: Contract['status'] = 'active';
    if (progress >= 100) {
      status = 'completed';
    }

    return this.update(contractId, {
      progress,
      status
    } as any);
  }

  /**
   * 更新合約狀態
   */
  updateStatus(contractId: string, status: Contract['status']): Observable<void> {
    const updateData: any = { status };
    
    // 如果狀態改為完成，自動設置進度為100%
    if (status === 'completed') {
      updateData.progress = 100;
    }

    return this.update(contractId, updateData);
  }

  /**
   * 生成合約編號
   */
  generateContractCode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-3); // 取時間戳後3位作為流水號
    
    return `${year}${month}${day}-${timestamp}`;
  }

  /**
   * 獲取合約統計
   */
  getContractStats(): Observable<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalAmount: number;
    averageProgress: number;
  }> {
    return this.getAll().pipe(
      map(contracts => {
        const total = contracts.length;
        const active = contracts.filter(c => c.status === 'active').length;
        const completed = contracts.filter(c => c.status === 'completed').length;
        const cancelled = contracts.filter(c => c.status === 'cancelled').length;
        const totalAmount = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
        const averageProgress = contracts.length > 0 
          ? contracts.reduce((sum, c) => sum + (c.progress || 0), 0) / contracts.length 
          : 0;

        return {
          total,
          active,
          completed,
          cancelled,
          totalAmount,
          averageProgress: Math.round(averageProgress * 100) / 100
        };
      })
    );
  }

  /**
   * 獲取即將到期的合約
   */
  getExpiringContracts(days: number = 30): Observable<Contract[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'active' },
        { field: 'endDate', operator: '<=', value: futureDate }
      ],
      orderBy: [{ field: 'endDate', direction: 'asc' }]
    });
  }

  /**
   * 獲取高價值合約（金額超過指定數額）
   */
  getHighValueContracts(minAmount: number = 1000000): Observable<Contract[]> {
    return this.getAll({
      where: [
        { field: 'amount', operator: '>=', value: minAmount }
      ],
      orderBy: [{ field: 'amount', direction: 'desc' }]
    });
  }

  /**
   * 根據專案經理獲取合約
   */
  getByProjectManager(projectManager: string): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'projectManager', operator: '==', value: projectManager }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * 根據業務負責人獲取合約
   */
  getBySalesPerson(salesPerson: string): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'salesPerson', operator: '==', value: salesPerson }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }
}