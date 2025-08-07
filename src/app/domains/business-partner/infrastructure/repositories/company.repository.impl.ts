import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, DocumentReference, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, catchError, finalize, shareReplay, timeout, of } from 'rxjs';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CompanyId } from '../../domain/value-objects/company-id.vo';
import { CompanyStatus, CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevel, RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { Contact } from '../../domain/entities/contact.entity';
import { CompanyProps } from '../../domain/entities/company.entity';

@Injectable({
    providedIn: 'root'
})
export class CompanyRepositoryImpl implements CompanyRepository {
    private readonly firestore = inject(Firestore);
    private readonly collectionName = 'companies';

    // 使用 shareReplay 進行快取
    private readonly companies$ = collectionData(collection(this.firestore, this.collectionName), { idField: 'id' }).pipe(
        map(docs => docs.map(doc => this.fromFirestore(doc))),
        shareReplay(1),
        catchError(error => {
            console.error('無法載入公司資料:', error);
            return [];
        })
    );

    private toFirestore(company: Company): any {
        // 將 Contact 對象轉換為普通 JavaScript 對象
        const contacts = company.contacts.map(contact => ({
            name: contact.name,
            title: contact.title,
            email: contact.email,
            phone: contact.phone,
            isPrimary: contact.isPrimary
        }));

        return {
            companyName: company.companyName,
            businessRegistrationNumber: company.businessRegistrationNumber,
            status: company.status.value,
            address: company.address,
            businessPhone: company.businessPhone,
            fax: company.fax,
            website: company.website,
            contractCount: company.contractCount,
            latestContractDate: company.latestContractDate,
            partnerSince: company.partnerSince,
            cooperationScope: company.cooperationScope,
            businessModel: company.businessModel,
            creditScore: company.creditScore,
            riskLevel: company.riskLevel.value,
            reviewHistory: company.reviewHistory,
            blacklistReason: company.blacklistReason,
            contacts: contacts,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };
    }

    private fromFirestore(docData: any): Company {
        // 確保聯絡人數據正確處理
        const contacts = Array.isArray(docData.contacts)
            ? docData.contacts.map((c: any) => Contact.create({
                name: c.name || '',
                title: c.title || '',
                email: c.email || '',
                phone: c.phone || '',
                isPrimary: c.isPrimary || false
            }))
            : [];

        const props: CompanyProps = {
            companyName: docData.companyName || '',
            businessRegistrationNumber: docData.businessRegistrationNumber || '',
            status: CompanyStatus.create(docData.status || CompanyStatusEnum.Active),
            address: docData.address || '',
            businessPhone: docData.businessPhone || '',
            fax: docData.fax || '',
            website: docData.website || '',
            contractCount: docData.contractCount || 0,
            latestContractDate: docData.latestContractDate ? docData.latestContractDate.toDate() : null,
            partnerSince: docData.partnerSince ? docData.partnerSince.toDate() : new Date(),
            cooperationScope: docData.cooperationScope || '',
            businessModel: docData.businessModel || '',
            creditScore: docData.creditScore || 0,
            riskLevel: RiskLevel.create(docData.riskLevel || RiskLevelEnum.Low),
            reviewHistory: docData.reviewHistory || '',
            blacklistReason: docData.blacklistReason || null,
            contacts: contacts,
            createdAt: docData.createdAt ? docData.createdAt.toDate() : new Date(),
            updatedAt: docData.updatedAt ? docData.updatedAt.toDate() : new Date(),
        };

        const company = Company.create(props);
        (company as any).id = CompanyId.create(docData.id);

        return company;
    }

    getAll(): Observable<Company[]> {
        const companiesRef = collection(this.firestore, this.collectionName);

        // 使用 getDocs 進行一次性讀取，而不是 collectionData 的實時監聽
        return from(getDocs(companiesRef)).pipe(
            timeout(10000), // 10秒超時
            map(querySnapshot => {
                const docs = querySnapshot.docs;
                console.log('Repository: Raw docs from Firestore:', docs.length);
                return docs.map(doc => {
                    const data = doc.data();
                    return this.fromFirestore({ ...data, id: doc.id });
                });
            }),
            catchError(error => {
                console.error('Repository: 無法載入公司清單:', error);
                // 返回空數組而不是拋出錯誤
                return of([]);
            })
        );
    }

    getById(id: string): Observable<Company | null> {
        const companyRef = doc(this.firestore, this.collectionName, id);
        return docData(companyRef, { idField: 'id' }).pipe(
            map(doc => doc ? this.fromFirestore(doc) : null),
            catchError(error => {
                console.error('無法載入公司詳細資料:', error);
                throw error;
            })
        );
    }

    create(company: Company): Observable<Company> {
        const companiesRef = collection(this.firestore, this.collectionName);
        const firestoreDoc = this.toFirestore(company);

        return from(addDoc(companiesRef, firestoreDoc)).pipe(
            map((docRef: DocumentReference) => {
                (company as any).id = CompanyId.create(docRef.id);
                return company;
            }),
            catchError(error => {
                console.error('新增公司失敗:', error);
                throw error;
            })
        );
    }

    update(id: string, company: Company): Observable<Company> {
        const companyRef = doc(this.firestore, this.collectionName, id);
        const firestoreDoc = this.toFirestore(company);

        return from(updateDoc(companyRef, firestoreDoc)).pipe(
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

    search(queryStr: string): Observable<Company[]> {
        if (!queryStr.trim()) {
            return this.getAll();
        }

        return this.getAll().pipe(
            map(companies => companies.filter(company =>
                company.companyName.toLowerCase().includes(queryStr.toLowerCase()) ||
                company.businessRegistrationNumber.includes(queryStr)
            )),
            catchError(error => {
                console.error('搜尋失敗:', error);
                throw error;
            })
        );
    }
}
