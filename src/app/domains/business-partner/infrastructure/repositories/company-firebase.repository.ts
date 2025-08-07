import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable, from, map, catchError, of } from 'rxjs';

import { Company } from '../../domain/entities/company.entity';
import { Contact } from '../../domain/entities/contact.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyId } from '../../domain/value-objects/company-id.vo';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { DynamicWorkflowStateVO } from '../../domain/value-objects/dynamic-workflow-state.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';

/**
 * Firebase 公司儲存庫實現
 * 極簡設計，專注數據持久化
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyFirebaseRepository extends CompanyRepository {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'companies';

  getAll(): Observable<Company[]> {
    const companiesRef = collection(this.firestore, this.collectionName);

    return from(getDocs(companiesRef)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return this.fromFirestore({ ...data, id: doc.id });
        });
      }),
      catchError(error => {
        console.error('獲取公司列表失敗:', error);
        return of([]);
      })
    );
  }

  getById(id: string): Observable<Company | null> {
    const companyRef = doc(this.firestore, this.collectionName, id);

    return docData(companyRef, { idField: 'id' }).pipe(
      map(data => (data ? this.fromFirestore(data) : null)),
      catchError(error => {
        console.error('獲取公司詳情失敗:', error);
        return of(null);
      })
    );
  }

  create(company: Company): Observable<Company> {
    const companiesRef = collection(this.firestore, this.collectionName);
    const firestoreData = this.toFirestore(company);

    return from(addDoc(companiesRef, firestoreData)).pipe(
      map(docRef => {
        // 創建新的公司實例，使用 Firestore 生成的 ID
        const newCompany = Company.create({
          companyName: company.companyName,
          businessRegistrationNumber: company.businessRegistrationNumber,
          address: company.address,
          businessPhone: company.businessPhone,
          status: company.status.value,
          riskLevel: company.riskLevel.value,
          fax: company.fax,
          website: company.website,
          contacts: company.contacts.map(c =>
            Contact.create({
              name: c.name,
              title: c.title,
              email: c.email,
              phone: c.phone,
              isPrimary: c.isPrimary
            })
          )
        });

        // 設置正確的 ID
        (newCompany as any).id = CompanyId.create(docRef.id);
        return newCompany;
      }),
      catchError(error => {
        console.error('創建公司失敗:', error);
        throw error;
      })
    );
  }

  update(id: string, company: Company): Observable<Company> {
    const companyRef = doc(this.firestore, this.collectionName, id);
    const firestoreData = this.toFirestore(company);

    return from(updateDoc(companyRef, firestoreData)).pipe(
      map(() => company),
      catchError(error => {
        console.error('更新公司失敗:', error);
        throw error;
      })
    );
  }

  delete(id: string): Observable<void> {
    const companyRef = doc(this.firestore, this.collectionName, id);

    return from(deleteDoc(companyRef)).pipe(
      catchError(error => {
        console.error('刪除公司失敗:', error);
        throw error;
      })
    );
  }

  search(query: string): Observable<Company[]> {
    // 簡單的客戶端搜尋實現
    return this.getAll().pipe(
      map(companies =>
        companies.filter(
          company => company.companyName.toLowerCase().includes(query.toLowerCase()) || company.businessRegistrationNumber.includes(query)
        )
      )
    );
  }

  /**
   * 轉換為 Firestore 格式
   */
  private toFirestore(company: Company): any {
    const firestoreData = {
      companyName: company.companyName,
      businessRegistrationNumber: company.businessRegistrationNumber,
      address: company.address,
      businessPhone: company.businessPhone,
      status: company.status.value,
      riskLevel: company.riskLevel.value,
      fax: company.fax,
      website: company.website,
      contacts: company.contacts.map(c => ({
        name: c.name,
        title: c.title,
        email: c.email,
        phone: c.phone,
        isPrimary: c.isPrimary
      })),
      dynamicWorkflow: company.dynamicWorkflow ? company.dynamicWorkflow.toPlainObject() : null,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };

    console.log('準備保存到 Firestore 的數據:', {
      companyId: company.companyId.value,
      dynamicWorkflow: firestoreData.dynamicWorkflow
    });

    return firestoreData;
  }

  /**
   * 從 Firestore 格式轉換
   */
  private fromFirestore(data: any): Company {
    const contacts = (data.contacts || []).map((c: any) =>
      Contact.create({
        name: c.name || '',
        title: c.title || '',
        email: c.email || '',
        phone: c.phone || '',
        isPrimary: c.isPrimary || false
      })
    );

    // 處理動態工作流程數據
    let dynamicWorkflow: DynamicWorkflowStateVO | null = null;
    if (data.dynamicWorkflow) {
      try {
        dynamicWorkflow = DynamicWorkflowStateVO.fromPlainObject(data.dynamicWorkflow);
      } catch (error) {
        console.warn('Failed to parse dynamic workflow data:', error);
        dynamicWorkflow = null;
      }
    }

    const company = Company.create({
      companyName: data.companyName || '',
      businessRegistrationNumber: data.businessRegistrationNumber || '',
      address: data.address || '',
      businessPhone: data.businessPhone || '',
      status: data.status || CompanyStatusEnum.Active,
      riskLevel: data.riskLevel || RiskLevelEnum.Low,
      fax: data.fax || '',
      website: data.website || '',
      contacts,
      dynamicWorkflow: dynamicWorkflow || undefined
    });

    // 設置正確的 ID 和時間戳
    (company as any).id = CompanyId.create(data.id);
    (company as any).createdAt = data.createdAt?.toDate?.() || new Date();
    (company as any).updatedAt = data.updatedAt?.toDate?.() || new Date();

    return company;
  }
}
