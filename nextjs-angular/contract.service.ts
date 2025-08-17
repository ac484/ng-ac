/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular合約服務-合約數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["BaseFirebaseService", "Contract", "BaseQueryOptions"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(ContractService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseFirebaseService } from './base-firebase.service';
import { Contract } from './types';

export interface CreateContractDto {
  title: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Terminated';
  fileUrl?: string;
  description?: string;
  value?: number;
  clientId?: string;
  projectId?: string;
}

export interface UpdateContractDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Active' | 'Expired' | 'Terminated';
  fileUrl?: string;
  description?: string;
  value?: number;
}

export interface ContractStats {
  total: number;
  active: number;
  expired: number;
  terminated: number;
  totalValue: number;
}

export interface ContractSearchFilters {
  status?: 'Active' | 'Expired' | 'Terminated';
  clientId?: string;
  projectId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minValue?: number;
  maxValue?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseFirebaseService<Contract> {
  constructor(firestore: any) {
    super(firestore, 'contracts');
  }

  // 獲取活躍合約
  getActiveContracts(): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Active' }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 獲取即將到期的合約
  getExpiringContracts(days: number = 30): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Active' }],
      orderBy: { field: 'endDate', direction: 'asc' }
    }).pipe(
      map(contracts => {
        const now = new Date();
        const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

        return contracts.filter(contract => {
          const endDate = new Date(contract.endDate);
          return endDate <= deadline && endDate >= now;
        });
      })
    );
  }

  // 根據客戶獲取合約
  getContractsByClient(clientId: string): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'clientId', operator: '==', value: clientId }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 根據專案獲取合約
  getContractsByProject(projectId: string): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'projectId', operator: '==', value: projectId }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 獲取合約統計
  getContractStats(): Observable<ContractStats> {
    return this.getAll().pipe(
      map(contracts => {
        const total = contracts.length;
        const active = contracts.filter(c => c.status === 'Active').length;
        const expired = contracts.filter(c => c.status === 'Expired').length;
        const terminated = contracts.filter(c => c.status === 'Terminated').length;
        const totalValue = contracts.reduce((sum, c) => sum + (c.value || 0), 0);

        return {
          total,
          active,
          expired,
          terminated,
          totalValue
        };
      }),
      catchError(error => {
        console.error('Error getting contract stats:', error);
        return throwError(() => new Error('Failed to get contract stats'));
      })
    );
  }

  // 搜索合約
  searchContracts(searchTerm: string): Observable<Contract[]> {
    return this.getAll().pipe(
      map(contracts => {
        return contracts.filter(contract =>
          contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.clientId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      catchError(error => {
        console.error('Error searching contracts:', error);
        return throwError(() => new Error('Failed to search contracts'));
      })
    );
  }

  // 根據過濾器獲取合約
  getContractsByFilters(filters: ContractSearchFilters): Observable<Contract[]> {
    return this.getAll().pipe(
      map(contracts => {
        let filtered = contracts;

        // 狀態過濾
        if (filters.status) {
          filtered = filtered.filter(c => c.status === filters.status);
        }

        // 客戶ID過濾
        if (filters.clientId) {
          filtered = filtered.filter(c => c.clientId === filters.clientId);
        }

        // 專案ID過濾
        if (filters.projectId) {
          filtered = filtered.filter(c => c.projectId === filters.projectId);
        }

        // 日期範圍過濾
        if (filters.dateRange) {
          filtered = filtered.filter(c => {
            const startDate = new Date(c.startDate);
            const endDate = new Date(c.endDate);
            return startDate >= filters.dateRange!.start && endDate <= filters.dateRange!.end;
          });
        }

        // 價值範圍過濾
        if (filters.minValue !== undefined) {
          filtered = filtered.filter(c => (c.value || 0) >= filters.minValue!);
        }

        if (filters.maxValue !== undefined) {
          filtered = filtered.filter(c => (c.value || 0) <= filters.maxValue!);
        }

        return filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      }),
      catchError(error => {
        console.error('Error filtering contracts:', error);
        return throwError(() => new Error('Failed to filter contracts'));
      })
    );
  }

  // 創建新合約
  createContract(contractData: CreateContractDto): Observable<string> {
    return this.create(contractData);
  }

  // 更新合約
  updateContract(contractId: string, updateData: UpdateContractDto): Observable<void> {
    return this.update(contractId, updateData);
  }

  // 更新合約狀態
  updateContractStatus(contractId: string, status: 'Active' | 'Expired' | 'Terminated'): Observable<void> {
    return this.update(contractId, { status });
  }

  // 獲取合約實時更新
  getContractsRealtime(): Observable<Contract[]> {
    return this.subscribeToCollection();
  }

  // 獲取單個合約實時更新
  getContractRealtime(contractId: string): Observable<Contract | null> {
    return this.subscribeToDocument(contractId);
  }

  // 批量更新合約狀態
  batchUpdateContractStatus(contractIds: string[], status: 'Active' | 'Expired' | 'Terminated'): Observable<void> {
    const operations = contractIds.map(id => ({
      type: 'update' as const,
      id,
      data: { status }
    }));

    return this.batch(operations);
  }

  // 獲取過期合約
  getExpiredContracts(): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Expired' }],
      orderBy: { field: 'endDate', direction: 'desc' }
    });
  }

  // 獲取終止合約
  getTerminatedContracts(): Observable<Contract[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Terminated' }],
      orderBy: { field: 'endDate', direction: 'desc' }
    });
  }

  // 檢查合約是否即將到期
  isContractExpiringSoon(contract: Contract, days: number = 30): boolean {
    if (contract.status !== 'Active') return false;

    const now = new Date();
    const endDate = new Date(contract.endDate);
    const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return endDate <= deadline && endDate >= now;
  }

  // 獲取合約價值統計
  getContractValueStats(): Observable<{
    totalValue: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
  }> {
    return this.getAll().pipe(
      map(contracts => {
        const values = contracts.map(c => c.value || 0).filter(v => v > 0);

        if (values.length === 0) {
          return {
            totalValue: 0,
            averageValue: 0,
            minValue: 0,
            maxValue: 0
          };
        }

        const totalValue = values.reduce((sum, v) => sum + v, 0);
        const averageValue = totalValue / values.length;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        return {
          totalValue,
          averageValue,
          minValue,
          maxValue
        };
      }),
      catchError(error => {
        console.error('Error getting contract value stats:', error);
        return throwError(() => new Error('Failed to get contract value stats'));
      })
    );
  }
}
