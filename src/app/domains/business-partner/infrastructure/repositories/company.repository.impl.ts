import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, DocumentReference } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CompanyId } from '../../domain/value-objects/company-id.vo';
import { CompanyStatus } from '../../domain/value-objects/company-status.vo';
import { RiskLevel } from '../../domain/value-objects/risk-level.vo';
import { Contact } from '../../domain/entities/contact.entity';
import { CompanyProps } from '../../domain/entities/company.entity';

@Injectable({
    providedIn: 'root'
})
export class CompanyRepositoryImpl implements CompanyRepository {
    private readonly firestore = inject(Firestore);
    private readonly collectionName = 'companies';

    private toFirestore(company: Company): any {
        const { companyId, ...data } = company;
        return {
            ...data,
            id: companyId.value,
            status: company.status.value,
            riskLevel: company.riskLevel.value,
        };
    }

    private fromFirestore(docData: any): Company {
        const props: CompanyProps = {
            companyName: docData.companyName,
            businessRegistrationNumber: docData.businessRegistrationNumber,
            status: CompanyStatus.create(docData.status),
            address: docData.address,
            businessPhone: docData.businessPhone,
            fax: docData.fax,
            website: docData.website,
            contractCount: docData.contractCount,
            latestContractDate: docData.latestContractDate ? docData.latestContractDate.toDate() : null,
            partnerSince: docData.partnerSince.toDate(),
            cooperationScope: docData.cooperationScope,
            businessModel: docData.businessModel,
            creditScore: docData.creditScore,
            riskLevel: RiskLevel.create(docData.riskLevel),
            reviewHistory: docData.reviewHistory,
            blacklistReason: docData.blacklistReason,
            contacts: docData.contacts.map((c: any) => Contact.create(c)),
            createdAt: docData.createdAt.toDate(),
            updatedAt: docData.updatedAt.toDate(),
        };

        const company = Company.create(props);
        (company as any).id = CompanyId.create(docData.id);

        return company;
    }

    getAll(): Observable<Company[]> {
        const companiesRef = collection(this.firestore, this.collectionName);
        return collectionData(companiesRef, { idField: 'id' }).pipe(
            map(docs => docs.map(doc => this.fromFirestore(doc)))
        );
    }

    getById(id: string): Observable<Company | null> {
        const companyRef = doc(this.firestore, this.collectionName, id);
        return docData(companyRef, { idField: 'id' }).pipe(
            map(doc => doc ? this.fromFirestore(doc) : null)
        );
    }

    create(company: Company): Observable<Company> {
        const companiesRef = collection(this.firestore, this.collectionName);
        const firestoreDoc = this.toFirestore(company);
        return from(addDoc(companiesRef, firestoreDoc)).pipe(
            map((docRef: DocumentReference) => {
                (company as any).id = CompanyId.create(docRef.id);
                return company;
            })
        );
    }

    update(id: string, company: Company): Observable<Company> {
        const companyRef = doc(this.firestore, this.collectionName, id);
        const firestoreDoc = this.toFirestore(company);
        return from(updateDoc(companyRef, firestoreDoc)).pipe(
            map(() => company)
        );
    }

    delete(id: string): Observable<void> {
        const companyRef = doc(this.firestore, this.collectionName, id);
        return from(deleteDoc(companyRef));
    }

    search(queryStr: string): Observable<Company[]> {
        if (!queryStr.trim()) {
            return this.getAll();
        }
        return this.getAll().pipe(
            map(companies => companies.filter(company =>
                company.companyName.toLowerCase().includes(queryStr.toLowerCase()) ||
                company.businessRegistrationNumber.includes(queryStr)
            ))
        );
    }
}
