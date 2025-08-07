import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CompanyResponseDto } from '../dto/company.dto';
import { CompanyMapper } from '../mappers/company.mapper';

/**
 * 獲取公司列表用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class GetCompaniesUseCase {
  private readonly companyRepository = inject(COMPANY_REPOSITORY);
  private readonly companyMapper = inject(CompanyMapper);

  execute(): Observable<CompanyResponseDto[]> {
    return this.companyRepository.getAll().pipe(map(companies => this.companyMapper.toResponseDtoList(companies)));
  }
}
