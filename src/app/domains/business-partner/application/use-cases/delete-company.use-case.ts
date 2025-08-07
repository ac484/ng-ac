import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';

/**
 * 刪除公司用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class DeleteCompanyUseCase {
  private readonly companyRepository = inject(COMPANY_REPOSITORY);

  execute(id: string): Observable<void> {
    return this.companyRepository.delete(id);
  }
}
