import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, WhereCondition, OrderCondition } from './base-firestore.service';

// 請款流程狀態枚舉
export enum PaymentFlowStatus {
  DRAFT = 'draft',           // 草稿
  SUBMITTED = 'submitted',   // 已提交
  REVIEWING = 'reviewing',   // 審核中
  APPROVED = 'approved',     // 已核准
  REJECTED = 'rejected',     // 已拒絕
  PROCESSING = 'processing', // 處理中
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled'    // 已取消
}

export interface Client extends BaseEntity {
  clientCode: string;        // 客戶編號
  clientName: string;        // 客戶名稱
  contactPerson: string;     // 聯絡人
  phoneNumber: string;       // 電話號碼
  email: string;             // 電子郵件
  address: string;           // 地址
  industry: string;          // 產業別
  companySize: string;       // 公司規模
  status: 'active' | 'inactive'; // 狀態
  notes: string;             // 備註
  lastContactDate?: Date;    // 最後聯絡日期
  paymentFlow: PaymentFlowStatus[]; // 請款流程列表
}

export interface ClientQuery {
  clientCode?: string;
  clientName?: string;
  contactPerson?: string;
  industry?: string;
  status?: Client['status'];
  sortBy?: 'createdAt' | 'clientName' | 'clientCode';
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  byIndustry: { [industry: string]: number };
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly baseService = inject(BaseFirestoreService);
  private readonly collectionName = 'clients';

  /** 生成客戶編號 */
  generateClientCode(): string {
    const rand = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `C${rand}`;
  }

  /** 檢查客戶編號是否存在 */
  checkClientCodeExists(code: string): Observable<boolean> {
    return this.baseService.findAll<Client>(this.collectionName, [
      { field: 'clientCode', operator: '==', value: code }
    ], [], 1).pipe(
      map((arr: Client[]) => arr.length > 0)
    );
  }

  /** 創建客戶 */
  create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    return this.baseService.create<Client>(this.collectionName, data);
  }

  /** 根據 ID 獲取客戶 */
  findById(id: string): Observable<Client | null> {
    return this.baseService.findById<Client>(this.collectionName, id);
  }

  /** 獲取所有客戶 */
  findAll(where: WhereCondition[] = [], order: OrderCondition[] = [], limit?: number): Observable<Client[]> {
    return this.baseService.findAll<Client>(this.collectionName, where, order, limit);
  }

  /** 查詢客戶 */
  queryClients(query: ClientQuery): Observable<Client[]> {
    const wl: WhereCondition[] = [];
    const ol: OrderCondition[] = [];
    if (query.clientCode) wl.push({ field: 'clientCode', operator: '>=', value: query.clientCode }, { field: 'clientCode', operator: '<=', value: query.clientCode + '\uF8FF' });
    if (query.clientName) wl.push({ field: 'clientName', operator: '>=', value: query.clientName }, { field: 'clientName', operator: '<=', value: query.clientName + '\uF8FF' });
    if (query.contactPerson) wl.push({ field: 'contactPerson', operator: '>=', value: query.contactPerson }, { field: 'contactPerson', operator: '<=', value: query.contactPerson + '\uF8FF' });
    if (query.industry) wl.push({ field: 'industry', operator: '==', value: query.industry });
    if (query.status) wl.push({ field: 'status', operator: '==', value: query.status });
    if (query.sortBy) ol.push({ field: query.sortBy, direction: query.sortOrder || 'asc' });
    return this.findAll(wl, ol, query.pageSize);
  }

  /** 更新客戶 */
  update(id: string, data: Partial<Client>): Observable<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }
    return this.baseService.modify<Client>(this.collectionName, id, data);
  }

  /** 刪除客戶 */
  delete(id: string): Observable<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }
    return this.baseService.remove(this.collectionName, id);
  }

  /** 批量刪除 */
  deleteBatch(ids: string[]): Observable<void[]> {
    return this.baseService.bulkRemove(this.collectionName, ids);
  }

  /** 獲取統計 */
  getClientStats(): Observable<ClientStats> {
    return this.findAll([], [], 1000).pipe(
      map((arr: Client[]) => {
        const stats: ClientStats = { total: arr.length, active: 0, inactive: 0, byIndustry: {} };
        arr.forEach(c => {
          c.status === 'active' ? stats.active++ : stats.inactive++;
          if (c.industry) stats.byIndustry[c.industry] = (stats.byIndustry[c.industry] || 0) + 1;
        });
        return stats;
      })
    );
  }
}
