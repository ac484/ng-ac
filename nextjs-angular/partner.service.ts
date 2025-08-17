/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular合作夥伴服務-合作夥伴數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["BaseFirebaseService", "Partner", "Contact", "Transaction", "PerformanceReview"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(PartnerService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseFirebaseService } from './base-firebase.service';
import {
    ComplianceDocument,
    Contact,
    Partner,
    PerformanceReview,
    Transaction
} from './types';

export interface CreatePartnerDto {
  name: string;
  logoUrl: string;
  category: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  status: 'Active' | 'Inactive' | 'Pending';
  overview: string;
  website: string;
  contacts?: Contact[];
  joinDate: string;
}

export interface UpdatePartnerDto {
  name?: string;
  logoUrl?: string;
  category?: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  status?: 'Active' | 'Inactive' | 'Pending';
  overview?: string;
  website?: string;
}

export interface PartnerStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byCategory: Record<string, number>;
}

export interface PartnerSearchFilters {
  status?: 'Active' | 'Inactive' | 'Pending';
  category?: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  joinDateRange?: {
    start: Date;
    end: Date;
  };
  hasContracts?: boolean;
  hasTransactions?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService extends BaseFirebaseService<Partner> {
  constructor(firestore: any) {
    super(firestore, 'partners');
  }

  // 獲取活躍合作夥伴
  getActivePartners(): Observable<Partner[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'Active' }],
      orderBy: { field: 'joinDate', direction: 'desc' }
    });
  }

  // 根據類別獲取合作夥伴
  getPartnersByCategory(category: Partner['category']): Observable<Partner[]> {
    return this.getAll({
      where: [{ field: 'category', operator: '==', value: category }],
      orderBy: { field: 'name', direction: 'asc' }
    });
  }

  // 獲取合作夥伴統計
  getPartnerStats(): Observable<PartnerStats> {
    return this.getAll().pipe(
      map(partners => {
        const total = partners.length;
        const active = partners.filter(p => p.status === 'Active').length;
        const inactive = partners.filter(p => p.status === 'Inactive').length;
        const pending = partners.filter(p => p.status === 'Pending').length;

        // 按類別統計
        const byCategory: Record<string, number> = {};
        partners.forEach(partner => {
          byCategory[partner.category] = (byCategory[partner.category] || 0) + 1;
        });

        return {
          total,
          active,
          inactive,
          pending,
          byCategory
        };
      }),
      catchError(error => {
        console.error('Error getting partner stats:', error);
        return throwError(() => new Error('Failed to get partner stats'));
      })
    );
  }

  // 搜索合作夥伴
  searchPartners(searchTerm: string): Observable<Partner[]> {
    return this.getAll().pipe(
      map(partners => {
        return partners.filter(partner =>
          partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.website.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      catchError(error => {
        console.error('Error searching partners:', error);
        return throwError(() => new Error('Failed to search partners'));
      })
    );
  }

  // 根據過濾器獲取合作夥伴
  getPartnersByFilters(filters: PartnerSearchFilters): Observable<Partner[]> {
    return this.getAll().pipe(
      map(partners => {
        let filtered = partners;

        // 狀態過濾
        if (filters.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }

        // 類別過濾
        if (filters.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        // 加入日期範圍過濾
        if (filters.joinDateRange) {
          filtered = filtered.filter(p => {
            const joinDate = new Date(p.joinDate);
            return joinDate >= filters.joinDateRange!.start && joinDate <= filters.joinDateRange!.end;
          });
        }

        // 是否有合約過濾
        if (filters.hasContracts !== undefined) {
          filtered = filtered.filter(p =>
            filters.hasContracts ? (p.contracts && p.contracts.length > 0) : (!p.contracts || p.contracts.length === 0)
          );
        }

        // 是否有交易過濾
        if (filters.hasTransactions !== undefined) {
          filtered = filtered.filter(p =>
            filters.hasTransactions ? (p.transactions && p.transactions.length > 0) : (!p.transactions || p.transactions.length === 0)
          );
        }

        return filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
      }),
      catchError(error => {
        console.error('Error filtering partners:', error);
        return throwError(() => new Error('Failed to filter partners'));
      })
    );
  }

  // 創建新合作夥伴
  createPartner(partnerData: CreatePartnerDto): Observable<string> {
    const newPartner: Omit<Partner, 'id'> = {
      ...partnerData,
      contacts: partnerData.contacts || [],
      transactions: [],
      performanceReviews: [],
      complianceDocuments: [],
      contracts: []
    };

    return this.create(newPartner);
  }

  // 更新合作夥伴
  updatePartner(partnerId: string, updateData: UpdatePartnerDto): Observable<void> {
    return this.update(partnerId, updateData);
  }

  // 更新合作夥伴狀態
  updatePartnerStatus(partnerId: string, status: 'Active' | 'Inactive' | 'Pending'): Observable<void> {
    return this.update(partnerId, { status });
  }

  // 添加聯絡人
  addContact(partnerId: string, contact: Contact): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedContacts = [...(partner.contacts || []), contact];
        return { partnerId, updatedContacts };
      }),
      map(({ partnerId, updatedContacts }) => {
        return this.update(partnerId, { contacts: updatedContacts });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding contact:', error);
        return throwError(() => new Error('Failed to add contact'));
      })
    );
  }

  // 更新聯絡人
  updateContact(partnerId: string, contactId: string, updatedContact: Contact): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedContacts = (partner.contacts || []).map(contact =>
          contact.id === contactId ? updatedContact : contact
        );

        return { partnerId, updatedContacts };
      }),
      map(({ partnerId, updatedContacts }) => {
        return this.update(partnerId, { contacts: updatedContacts });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error updating contact:', error);
        return throwError(() => new Error('Failed to update contact'));
      })
    );
  }

  // 刪除聯絡人
  deleteContact(partnerId: string, contactId: string): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedContacts = (partner.contacts || []).filter(contact => contact.id !== contactId);
        return { partnerId, updatedContacts };
      }),
      map(({ partnerId, updatedContacts }) => {
        return this.update(partnerId, { contacts: updatedContacts });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error deleting contact:', error);
        return throwError(() => new Error('Failed to delete contact'));
      })
    );
  }

  // 添加交易記錄
  addTransaction(partnerId: string, transaction: Transaction): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedTransactions = [...(partner.transactions || []), transaction];
        return { partnerId, updatedTransactions };
      }),
      map(({ partnerId, updatedTransactions }) => {
        return this.update(partnerId, { transactions: updatedTransactions });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding transaction:', error);
        return throwError(() => new Error('Failed to add transaction'));
      })
    );
  }

  // 添加績效評估
  addPerformanceReview(partnerId: string, review: PerformanceReview): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedReviews = [...(partner.performanceReviews || []), review];
        return { partnerId, updatedReviews };
      }),
      map(({ partnerId, updatedReviews }) => {
        return this.update(partnerId, { performanceReviews: updatedReviews });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding performance review:', error);
        return throwError(() => new Error('Failed to add performance review'));
      })
    );
  }

  // 添加合規文件
  addComplianceDocument(partnerId: string, document: ComplianceDocument): Observable<void> {
    return this.getById(partnerId).pipe(
      map(partner => {
        if (!partner) {
          throw new Error('Partner not found');
        }

        const updatedDocuments = [...(partner.complianceDocuments || []), document];
        return { partnerId, updatedDocuments };
      }),
      map(({ partnerId, updatedDocuments }) => {
        return this.update(partnerId, { complianceDocuments: updatedDocuments });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding compliance document:', error);
        return throwError(() => new Error('Failed to add compliance document'));
      })
    );
  }

  // 獲取合作夥伴實時更新
  getPartnersRealtime(): Observable<Partner[]> {
    return this.subscribeToCollection();
  }

  // 獲取單個合作夥伴實時更新
  getPartnerRealtime(partnerId: string): Observable<Partner | null> {
    return this.subscribeToDocument(partnerId);
  }

  // 獲取即將到期的合規文件
  getExpiringComplianceDocuments(days: number = 30): Observable<{
    partner: Partner;
    documents: ComplianceDocument[];
  }[]> {
    return this.getAll().pipe(
      map(partners => {
        const now = new Date();
        const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

        return partners
          .filter(partner => partner.complianceDocuments && partner.complianceDocuments.length > 0)
          .map(partner => {
            const expiringDocuments = partner.complianceDocuments!.filter(doc => {
              if (doc.status === 'Expired') return false;
              const expiryDate = new Date(doc.expiryDate);
              return expiryDate <= deadline && expiryDate >= now;
            });

            return {
              partner,
              documents: expiringDocuments
            };
          })
          .filter(result => result.documents.length > 0)
          .sort((a, b) => {
            const aEarliest = Math.min(...a.documents.map(d => new Date(d.expiryDate).getTime()));
            const bEarliest = Math.min(...b.documents.map(d => new Date(d.expiryDate).getTime()));
            return aEarliest - bEarliest;
          });
      }),
      catchError(error => {
        console.error('Error getting expiring compliance documents:', error);
        return throwError(() => new Error('Failed to get expiring compliance documents'));
      })
    );
  }

  // 獲取合作夥伴績效統計
  getPartnerPerformanceStats(): Observable<{
    partnerId: string;
    partnerName: string;
    averageRating: number;
    totalReviews: number;
    totalTransactions: number;
    totalValue: number;
  }[]> {
    return this.getAll().pipe(
      map(partners => {
        return partners.map(partner => {
          const totalReviews = partner.performanceReviews?.length || 0;
          const averageRating = totalReviews > 0
            ? partner.performanceReviews!.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

          const totalTransactions = partner.transactions?.length || 0;
          const totalValue = partner.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

          return {
            partnerId: partner.id!,
            partnerName: partner.name,
            averageRating: Math.round(averageRating * 100) / 100,
            totalReviews,
            totalTransactions,
            totalValue
          };
        }).sort((a, b) => b.averageRating - a.averageRating);
      }),
      catchError(error => {
        console.error('Error getting partner performance stats:', error);
        return throwError(() => new Error('Failed to get partner performance stats'));
      })
    );
  }
}
