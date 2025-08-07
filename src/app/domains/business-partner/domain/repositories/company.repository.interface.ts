import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../entities/company.entity';

export const COMPANY_REPOSITORY = new InjectionToken<CompanyRepository>('CompanyRepository');

/**
 * 公司倉儲介面
 */
export interface CompanyRepository {
    getAll(): Observable<Company[]>;
    getById(id: string): Observable<Company | null>;
    create(company: Company): Observable<Company>;
    update(id: string, company: Company): Observable<Company>;
    delete(id: string): Observable<void>;
    search(query: string): Observable<Company[]>;
}
