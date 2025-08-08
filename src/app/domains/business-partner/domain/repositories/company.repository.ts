import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Company } from '../entities/company.entity';

/**
 * 公司儲存庫介面
 * 極簡設計，只包含必要的 CRUD 操作
 */
export abstract class CompanyRepository {
  abstract getAll(): Observable<Company[]>;
  abstract getById(id: string): Observable<Company | null>;
  abstract create(company: Company): Observable<Company>;
  abstract update(id: string, company: Company): Observable<Company>;
  abstract delete(id: string): Observable<void>;
  abstract search(query: string): Observable<Company[]>;
}

// 注入令牌
export const COMPANY_REPOSITORY = new InjectionToken<CompanyRepository>('COMPANY_REPOSITORY');
